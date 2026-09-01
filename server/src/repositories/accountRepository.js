import pool from "../db/pool.js";

export const createAccount = async (accountNumber, holderName, initialBalance) => {
    const query = `
        INSERT INTO accounts (
            account_number,
            holder_name,
            balance
        )
        VALUES ($1, $2, $3)
        RETURNING id, account_number, holder_name, balance, created_at;
    `;

    const values = [
        accountNumber,
        holderName,
        initialBalance
    ];

    const result = await pool.query(query, values);

    return result.rows[0];
};


export const getAccountById = async (accountId) => {
    const query = `
        SELECT id, account_number, holder_name, balance
        FROM accounts
        WHERE id = $1;
    `;

    const result = await pool.query(query, [accountId]);

    return result.rows[0];
};