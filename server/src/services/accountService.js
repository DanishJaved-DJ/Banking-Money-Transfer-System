import { createAccount , getAccountById , getAllAccounts} from "../repositories/accountRepository.js";

export const createNewAccount = async (holderName, initialBalance) => {

    if (!holderName || holderName.trim().length === 0) {
        throw new Error("Holder name is required");
    }

    if (initialBalance < 0) {
        throw new Error("Initial balance cannot be negative");
    }

    const accountNumber =
        "ACC" + Date.now();

    return await createAccount(
        accountNumber,
        holderName.trim(),
        initialBalance
    );
};

export const getAccountBalance = async (accountId) => {
    const account = await getAccountById(accountId);

    if (!account) {
        throw new Error("Account not found");
    }

    return {
        accountId: account.id,
        accountNumber: account.account_number,
        balance: Number(account.balance)
    };
};

export const getAccounts = async () => {
    return await getAllAccounts();
};