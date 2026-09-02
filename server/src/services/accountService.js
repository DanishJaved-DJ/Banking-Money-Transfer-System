import {
  createAccount,
  getAccountById,
  getAllAccounts,
} from "../repositories/accountRepository.js";
import { AppError } from "../utils/AppError.js";

export const createNewAccount = async (holderName, initialBalance) => {
  if (!holderName || holderName.trim().length === 0) {
    throw new AppError("Holder name is required", 400);
  }

  const parsedBalance = Number(initialBalance);

  if (!Number.isFinite(parsedBalance) || parsedBalance < 0) {
    throw new AppError("Initial balance cannot be negative", 400);
  }

  const accountNumber = "ACC" + Date.now();

  return await createAccount(accountNumber, holderName.trim(), parsedBalance);
};

export const getAccountBalance = async (accountId) => {
  const account = await getAccountById(accountId);

  if (!account) {
    throw new AppError("Account not found", 404);
  }

  return {
    accountId: account.id,
    accountNumber: account.account_number,
    balance: Number(account.balance),
  };
};

export const getAccounts = async () => {
  return await getAllAccounts();
};
