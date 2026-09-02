import pool from "../db/pool.js";
import { AppError } from "../utils/AppError.js";

export const transferMoney = async (
  fromAccountId,
  toAccountId,
  amount,
  transactionRef,
) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const normalizedFromId = Number(fromAccountId);
    const normalizedToId = Number(toAccountId);

    const firstId = Math.min(normalizedFromId, normalizedToId);
    const secondId = Math.max(normalizedFromId, normalizedToId);

    const accountResult = await client.query(
      `
            SELECT id, balance
            FROM accounts
            WHERE id IN ($1, $2)
            ORDER BY id
            FOR UPDATE;
            `,
      [firstId, secondId],
    );

    if (accountResult.rows.length !== 2) {
      const foundIds = accountResult.rows.map((account) => Number(account.id));
      const missingIds = [normalizedFromId, normalizedToId].filter(
        (id) => !foundIds.includes(id),
      );

      throw new AppError(
        missingIds.length
          ? `Account not found: ${missingIds.join(", ")}`
          : "One or both accounts not found",
        404,
      );
    }

    const sender = accountResult.rows.find(
      (account) => Number(account.id) === normalizedFromId,
    );

    const receiver = accountResult.rows.find(
      (account) => Number(account.id) === normalizedToId,
    );

    if (!sender || !receiver) {
      throw new AppError("One or both accounts not found", 404);
    }

    if (Number(sender.balance) < Number(amount)) {
      throw new AppError("Insufficient balance", 400);
    }

    await client.query(
      `
            UPDATE accounts
            SET
                balance = balance - $1,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $2;
            `,
      [amount, fromAccountId],
    );

    await client.query(
      `
            UPDATE accounts
            SET
                balance = balance + $1,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $2;
            `,
      [amount, toAccountId],
    );

    const transactionResult = await client.query(
      `
            INSERT INTO transactions (
                transaction_ref,
                from_account_id,
                to_account_id,
                amount,
                status
            )
            VALUES ($1, $2, $3, $4, $5)
            RETURNING
                id,
                transaction_ref,
                from_account_id,
                to_account_id,
                amount,
                status,
                created_at;
            `,
      [transactionRef, fromAccountId, toAccountId, amount, "SUCCESS"],
    );

    await client.query("COMMIT");

    return transactionResult.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
