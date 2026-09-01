import { getAccountById } from "../repositories/accountRepository.js";
import { getTransactionsByAccountId } from "../repositories/transactionRepository.js";

export const getAccountTransactions = async (accountId) => {
    const account = await getAccountById(accountId);

    if (!account) {
        throw new Error("Account not found");
    }

    return await getTransactionsByAccountId(accountId);
};