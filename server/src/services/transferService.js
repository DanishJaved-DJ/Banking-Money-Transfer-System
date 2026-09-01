import { transferMoney } from "../repositories/transferRepository.js";

export const createTransfer = async (
    fromAccountId,
    toAccountId,
    amount
) => {

    if (!fromAccountId || !toAccountId) {
        throw new Error("Both accounts are required");
    }

    if (fromAccountId === toAccountId) {
        throw new Error(
            "Cannot transfer money to the same account"
        );
    }

    if (!Number.isFinite(amount) || amount <= 0) {
        throw new Error(
            "Transfer amount must be greater than zero"
        );
    }

    const transactionRef =
        `TXN-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    return await transferMoney(
        fromAccountId,
        toAccountId,
        amount,
        transactionRef
    );
};