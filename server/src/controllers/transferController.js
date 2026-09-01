import { createTransfer } from "../services/transferService.js";

export const transfer = async (req, res) => {

    try {

        const {
            fromAccountId,
            toAccountId,
            amount
        } = req.body;

        const transaction = await createTransfer(
            Number(fromAccountId),
            Number(toAccountId),
            Number(amount)
        );

        res.status(201).json({
            transactionId: transaction.id,
            transactionRef: transaction.transaction_ref,
            fromAccountId: transaction.from_account_id,
            toAccountId: transaction.to_account_id,
            amount: Number(transaction.amount),
            status: transaction.status,
            createdAt: transaction.created_at
        });

    } catch (error) {

        res.status(400).json({
            message: error.message
        });
    }
};