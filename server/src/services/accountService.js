import { createAccount } from "../repositories/accountRepository.js";

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