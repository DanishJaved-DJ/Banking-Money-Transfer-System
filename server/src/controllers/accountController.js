import { createNewAccount } from "../services/accountService.js";

export const createAccount = async (req, res) => {
    try {

        const { holderName, initialBalance } = req.body;

        const account = await createNewAccount(
            holderName,
            initialBalance
        );

        res.status(201).json({
            accountId: account.id,
            accountNumber: account.account_number,
            holderName: account.holder_name,
            balance: Number(account.balance)
        });

    } catch (error) {

        res.status(400).json({
            message: error.message
        });
    }
};