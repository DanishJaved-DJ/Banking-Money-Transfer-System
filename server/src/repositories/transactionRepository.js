import pool from "../db/pool.js";

export const getTransactionsByAccountId = async (accountId) => {
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
        ORDER BY created_at DESC;
    `;

    const result = await pool.query(query, [accountId]);

    return result.rows;
};