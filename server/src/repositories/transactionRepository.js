import pool from "../db/pool.js";

export const getTransactionsByAccountId = async (accountId, limit, offset) => {
  const query = `
        SELECT
            id,
            transaction_ref,
            from_account_id,
            to_account_id,
            amount,
            status,
            created_at
        FROM transactions
        WHERE from_account_id = $1
           OR to_account_id = $1
        ORDER BY created_at DESC
        LIMIT $2
        OFFSET $3;
    `;

  const result = await pool.query(query, [accountId, limit, offset]);

  return result.rows;
};

export const getTransactionCount = async (accountId) => {
  const query = `
        SELECT COUNT(*) AS total
        FROM transactions
        WHERE from_account_id = $1
           OR to_account_id = $1;
    `;

  const result = await pool.query(query, [accountId]);

  return Number(result.rows[0].total);
};
