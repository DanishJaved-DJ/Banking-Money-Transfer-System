import { useEffect, useState } from "react";
import {
    getBalance,
    getTransactions,
    transferMoney
} from "../services/api";

const Dashboard = ({ accountId, onBack }) => {
    const [account, setAccount] = useState(null);
    const [transactions, setTransactions] = useState([]);

    const [toAccountId, setToAccountId] = useState("");
    const [amount, setAmount] = useState("");

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const loadAccountData = async () => {
        try {
            const balanceData = await getBalance(accountId);
            const transactionData = await getTransactions(accountId);

            setAccount(balanceData);
            setTransactions(transactionData.transactions || []);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        loadAccountData();
    }, [accountId]);

    const handleTransfer = async (e) => {
        e.preventDefault();

        setLoading(true);
        setMessage("");

        try {
            const response = await transferMoney({
                fromAccountId: Number(accountId),
                toAccountId: Number(toAccountId),
                amount: Number(amount)
            });

            if (response.message) {
                setMessage(response.message);
                return;
            }

            setMessage("Transfer successful");

            setToAccountId("");
            setAmount("");

            await loadAccountData();

        } catch (error) {
            console.error(error);
            setMessage("Transfer failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">

            <div className="mx-auto max-w-5xl">

                {/* Back Button */}
                <button
                    onClick={onBack}
                    className="mb-6 rounded-lg border bg-white px-4 py-2 text-sm hover:bg-gray-50"
                >
                    ← Back to Accounts
                </button>

                <h1 className="mb-8 text-3xl font-bold">
                    Account Dashboard
                </h1>

                {/* Account Details */}
                {account && (
                    <div className="mb-8 rounded-xl bg-white p-6 shadow">

                        <p className="text-sm text-gray-500">
                            Account Number
                        </p>

                        <p className="text-xl font-semibold">
                            {account.accountNumber}
                        </p>

                        <p className="mt-4 text-sm text-gray-500">
                            Current Balance
                        </p>

                        <p className="text-3xl font-bold">
                            ₹{Number(account.balance).toFixed(2)}
                        </p>

                    </div>
                )}

                {/* Transfer Money */}
                <div className="mb-8 rounded-xl bg-white p-6 shadow">

                    <h2 className="mb-4 text-xl font-semibold">
                        Transfer Money
                    </h2>

                    <form
                        onSubmit={handleTransfer}
                        className="space-y-4"
                    >

                        <div>
                            <label className="mb-1 block text-sm font-medium">
                                To Account
                            </label>

                            <input
                                type="number"
                                value={toAccountId}
                                onChange={(e) =>
                                    setToAccountId(e.target.value)
                                }
                                className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-black"
                                placeholder="Enter account ID"
                                required
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium">
                                Amount
                            </label>

                            <input
                                type="number"
                                step="0.01"
                                min="0.01"
                                value={amount}
                                onChange={(e) =>
                                    setAmount(e.target.value)
                                }
                                className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-black"
                                placeholder="Enter amount"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-lg bg-black px-5 py-3 text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loading
                                ? "Processing..."
                                : "Transfer"}
                        </button>

                    </form>

                    {message && (
                        <p className="mt-4 text-sm font-medium">
                            {message}
                        </p>
                    )}

                </div>

                {/* Transaction History */}
                <div className="rounded-xl bg-white p-6 shadow">

                    <h2 className="mb-4 text-xl font-semibold">
                        Transaction History
                    </h2>

                    {transactions.length === 0 ? (

                        <p className="text-gray-500">
                            No transactions yet.
                        </p>

                    ) : (

                        <div className="space-y-3">

                            {transactions.map((transaction) => {

                                const isDebit =
                                    Number(
                                        transaction.from_account_id
                                    ) === Number(accountId);

                                return (
                                    <div
                                        key={transaction.id}
                                        className="flex items-center justify-between border-b pb-3"
                                    >

                                        <div>
                                            <p className="font-medium">
                                                {isDebit
                                                    ? "DEBIT"
                                                    : "CREDIT"}
                                            </p>

                                            <p className="text-sm text-gray-500">
                                                Transaction:{" "}
                                                {
                                                    transaction.transaction_ref
                                                }
                                            </p>
                                        </div>

                                        <div className="text-right">

                                            <p className="font-semibold">
                                                ₹
                                                {Number(
                                                    transaction.amount
                                                ).toFixed(2)}
                                            </p>

                                            <p className="text-sm text-gray-500">
                                                {transaction.status}
                                            </p>

                                        </div>

                                    </div>
                                );
                            })}

                        </div>

                    )}

                </div>

            </div>

        </div>
    );
};

export default Dashboard;