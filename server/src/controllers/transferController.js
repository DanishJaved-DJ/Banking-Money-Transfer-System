import { createTransfer } from "../services/transferService.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const transfer = async (req, res, next) => {
  try {
    const { fromAccountId, toAccountId, amount } = req.body;

    const transaction = await createTransfer(
      Number(fromAccountId),
      Number(toAccountId),
      Number(amount),
    );

    const response = new ApiResponse(201, "Transfer completed successfully", {
      transactionId: transaction.id,
      transactionRef: transaction.transaction_ref,
      fromAccountId: transaction.from_account_id,
      toAccountId: transaction.to_account_id,
      amount: Number(transaction.amount),
      status: transaction.status,
      createdAt: transaction.created_at,
    });

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};
