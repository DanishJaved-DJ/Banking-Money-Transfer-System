import pool from "../db/pool.js";

export const transferMoney = async (
    fromAccountId,
    toAccountId,
    amount,
    transactionRef
) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        // Always lock accounts in the same order.
        // This helps prevent deadlocks when concurrent transfers
        // happen in opposite directions.
        const firstId = Math.min(fromAccountId, toAccountId);
        const secondId = Math.max(fromAccountId, toAccountId);

        const accountResult = await client.query(
            `
            SELECT id, balance
            FROM accounts
            WHERE id IN ($1, $2)
            ORDER BY id
            FOR UPDATE;
            `,
            [firstId, secondId]
        );

        // Both accounts must exist
        if (accountResult.rows.length !== 2) {
            throw new Error("One or both accounts not found");
        }

        // Find sender and receiver explicitly
        const sender = accountResult.rows.find(
            (account) =>
                Number(account.id) === Number(fromAccountId)
        );

        const receiver = accountResult.rows.find(
            (account) =>
                Number(account.id) === Number(toAccountId)
        );

        if (!sender || !receiver) {
            throw new Error("One or both accounts not found");
        }

        // Check sender balance
        if (Number(sender.balance) < Number(amount)) {
            throw new Error("Insufficient balance");
        }

        // Debit sender
        await client.query(
            `
            UPDATE accounts
            SET
                balance = balance - $1,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $2;
            `,
            [amount, fromAccountId]
        );

        // Credit receiver
        await client.query(
            `
            UPDATE accounts
            SET
                balance = balance + $1,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $2;
            `,
            [amount, toAccountId]
        );

        // Create transaction record
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
            [
                transactionRef,
                fromAccountId,
                toAccountId,
                amount,
                "SUCCESS"
            ]
        );

        // Everything succeeded
        await client.query("COMMIT");

        return transactionResult.rows[0];

    } catch (error) {

        // Something failed → undo everything
        await client.query("ROLLBACK");

        throw error;

    } finally {

        // Return connection to pool
        client.release();
    }
};