import { createNewAccount , getAccountBalance , getAccounts } from "../services/accountService.js";

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

export const getBalance = async (req, res) => {
    try {
        const { accountId } = req.params;

        const account = await getAccountBalance(accountId);

        res.status(200).json(account);

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

export const getAllAccounts = async (req, res) => {
    try {
        const accounts = await getAccounts();

        res.status(200).json({
            accounts
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};