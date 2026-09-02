import { useEffect, useState } from "react";
import { createAccount, getAccounts } from "../services/api";

const Accounts = ({ onSelectAccount }) => {
  const [accounts, setAccounts] = useState([]);

  const [holderName, setHolderName] = useState("");
  const [initialBalance, setInitialBalance] = useState("");

  const [showForm, setShowForm] = useState(false);

  const loadAccounts = async () => {
    const response = await getAccounts();
    setAccounts(response?.data?.accounts || []);
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  const handleCreateAccount = async (e) => {
    e.preventDefault();

    await createAccount({
      holderName,
      initialBalance: Number(initialBalance),
    });

    setHolderName("");
    setInitialBalance("");
    setShowForm(false);

    await loadAccounts();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">My Accounts</h1>

          <button
            onClick={() => setShowForm(!showForm)}
            className="rounded-lg bg-black px-5 py-3 text-white"
          >
            + Create Account
          </button>
        </div>

        {showForm && (
          <form
            onSubmit={handleCreateAccount}
            className="mb-8 rounded-xl bg-white p-6 shadow"
          >
            <h2 className="mb-4 text-xl font-semibold">Create Account</h2>

            <input
              type="text"
              placeholder="Holder name"
              value={holderName}
              onChange={(e) => setHolderName(e.target.value)}
              className="mb-4 w-full rounded-lg border p-3"
              required
            />

            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="Initial balance"
              value={initialBalance}
              onChange={(e) => setInitialBalance(e.target.value)}
              className="mb-4 w-full rounded-lg border p-3"
              required
            />

            <button
              type="submit"
              className="rounded-lg bg-black px-5 py-3 text-white"
            >
              Create Account
            </button>
          </form>
        )}

        <div className="grid gap-5 md:grid-cols-2">
          {accounts.map((account) => (
            <div key={account.id} className="rounded-xl bg-white p-6 shadow">
              <p className="text-sm text-gray-500">Account Number</p>

              <p className="text-xl font-semibold">{account.account_number}</p>
              <p className="mt-4 text-sm text-gray-500">Account ID</p>

              <p className="text-lg font-medium">{account.id}</p>

              <p className="mt-3 text-gray-600">{account.holder_name}</p>

              <p className="mt-4 text-2xl font-bold">
                ₹{Number(account.balance).toFixed(2)}
              </p>

              <button
                onClick={() => onSelectAccount(account.id)}
                className="mt-5 w-full rounded-lg bg-black px-4 py-3 text-white"
              >
                View Account
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Accounts;
