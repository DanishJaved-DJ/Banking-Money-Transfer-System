import { getAccountById } from "../repositories/accountRepository.js";
import {
  getTransactionsByAccountId,
  getTransactionCount,
} from "../repositories/transactionRepository.js";
import { AppError } from "../utils/AppError.js";

export const getAccountTransactions = async (
  accountId,
  page = 1,
  limit = 10,
) => {
  const account = await getAccountById(accountId);

  if (!account) {
    throw new AppError("Account not found", 404);
  }

  const parsedPage = Number(page);
  const parsedLimit = Number(limit);

  if (!Number.isInteger(parsedPage) || parsedPage < 1) {
    throw new AppError("Page must be greater than 0", 400);
  }

  if (!Number.isInteger(parsedLimit) || parsedLimit < 1 || parsedLimit > 100) {
    throw new AppError("Limit must be between 1 and 100", 400);
  }

  const offset = (parsedPage - 1) * parsedLimit;
  const transactions = await getTransactionsByAccountId(
    accountId,
    parsedLimit,
    offset,
  );
  const total = await getTransactionCount(accountId);

  return {
    transactions,
    pagination: {
      page: parsedPage,
      limit: parsedLimit,
      total,
      totalPages: Math.max(1, Math.ceil(total / parsedLimit)),
    },
  };
};
