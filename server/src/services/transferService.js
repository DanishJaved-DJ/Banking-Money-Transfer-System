import { transferMoney } from "../repositories/transferRepository.js";
import { AppError } from "../utils/AppError.js";

export const createTransfer = async (fromAccountId, toAccountId, amount) => {
  if (!fromAccountId || !toAccountId) {
    throw new AppError("Both accounts are required", 400);
  }

  const normalizedFromId = Number(fromAccountId);
  const normalizedToId = Number(toAccountId);

  if (!Number.isInteger(normalizedFromId) || normalizedFromId <= 0) {
    throw new AppError("Sender account ID is invalid", 400);
  }

  if (!Number.isInteger(normalizedToId) || normalizedToId <= 0) {
    throw new AppError("Receiver account ID is invalid", 400);
  }

  if (normalizedFromId === normalizedToId) {
    throw new AppError("Cannot transfer money to the same account", 400);
  }

  const numericAmount = Number(amount);

  if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
    throw new AppError("Transfer amount must be greater than zero", 400);
  }

  const transactionRef = `TXN-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

  return await transferMoney(
    normalizedFromId,
    normalizedToId,
    numericAmount,
    transactionRef,
  );
};
