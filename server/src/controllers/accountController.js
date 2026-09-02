import {
  createNewAccount,
  getAccountBalance,
  getAccounts,
} from "../services/accountService.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const createAccount = async (req, res, next) => {
  try {
    const { holderName, initialBalance } = req.body;

    const account = await createNewAccount(holderName, initialBalance);

    const response = new ApiResponse(201, "Account created successfully", {
      accountId: account.id,
      accountNumber: account.account_number,
      holderName: account.holder_name,
      balance: Number(account.balance),
    });

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

export const getBalance = async (req, res, next) => {
  try {
    const { accountId } = req.params;

    const account = await getAccountBalance(accountId);

    const response = new ApiResponse(
      200,
      "Account balance retrieved successfully",
      account,
    );

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const getAllAccounts = async (req, res, next) => {
  try {
    const accounts = await getAccounts();

    const response = new ApiResponse(200, "Accounts retrieved successfully", {
      accounts,
    });

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
