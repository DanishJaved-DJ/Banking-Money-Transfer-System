import { getAccountTransactions } from "../services/transactionService.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const getTransactions = async (req, res, next) => {
  try {
    const { accountId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const result = await getAccountTransactions(
      Number(accountId),
      Number(page),
      Number(limit),
    );

    res
      .status(200)
      .json(new ApiResponse(200, "Transactions fetched successfully", result));
  } catch (error) {
    next(error);
  }
};
