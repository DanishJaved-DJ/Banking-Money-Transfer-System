import { getAccountTransactions } from "../services/transactionService.js";

export const getTransactions = async (req, res) => {
    try {
        const { accountId } = req.params;

        const transactions = await getAccountTransactions(accountId);

        res.status(200).json({
            accountId: Number(accountId),
            transactions
        });

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};