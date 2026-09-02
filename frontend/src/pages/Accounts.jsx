import { useEffect, useMemo, useState } from "react";
import { createAccount, getAccounts } from "../services/api";

const Accounts = ({ onSelectAccount }) => {
  const [accounts, setAccounts] = useState([]);
  const [holderName, setHolderName] = useState("");
  const [initialBalance, setInitialBalance] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const summary = useMemo(() => {
    const totalBalance = accounts.reduce(
      (sum, account) => sum + Number(account.balance || 0),
      0,
    );

    return {
      totalAccounts: accounts.length,
      totalBalance,
    };
  }, [accounts]);

  const loadAccounts = async () => {
    setIsLoading(true);

    try {
      const response = await getAccounts();
      setAccounts(response?.data?.accounts || []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      await createAccount({
        holderName,
        initialBalance: Number(initialBalance),
      });

      setHolderName("");
      setInitialBalance("");
      setShowForm(false);
      await loadAccounts();
    } catch (error) {
      console.error(error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="banking-shell">
      <div className="container-shell">
        <header className="page-header">
          <div>
            <p className="eyebrow">Banking overview</p>
            <h1>Demo Dashboard</h1>
          </div>

          <button
            type="button"
            onClick={() => setShowForm(!showForm)}
            className="primary-button"
          >
            {showForm ? "Close form" : "+ Create Account"}
          </button>
        </header>

        <section className="metrics-grid">
          <div className="metric-card accent-blue">
            <span>Total Accounts</span>
            <strong>{summary.totalAccounts}</strong>
          </div>

          <div className="metric-card accent-green">
            <span>Total Balance</span>
            <strong>₹{Number(summary.totalBalance).toFixed(2)}</strong>
          </div>
        </section>

        {showForm && (
          <section className="glass-card form-panel">
            <div className="section-header">
              <h2>Create Account</h2>
            </div>

            <form onSubmit={handleCreateAccount} className="account-form">
              <label>
                <span>Holder name</span>
                <input
                  type="text"
                  placeholder="Enter account holder name"
                  value={holderName}
                  onChange={(e) => setHolderName(e.target.value)}
                  className="form-field"
                  required
                />
              </label>

              <label>
                <span>Initial balance</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Enter starting balance"
                  value={initialBalance}
                  onChange={(e) => setInitialBalance(e.target.value)}
                  className="form-field"
                  required
                />
              </label>

              <button
                type="submit"
                className="primary-button"
                disabled={isCreating}
              >
                {isCreating ? "Creating..." : "Create Account"}
              </button>
            </form>
          </section>
        )}

        <section className="accounts-grid">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="glass-card account-card skeleton-card"
              >
                <div className="skeleton-line small" />
                <div className="skeleton-line long" />
                <div className="skeleton-line medium" />
                <div className="skeleton-line large" />
                <div className="skeleton-button" />
              </div>
            ))
          ) : accounts.length === 0 ? (
            <div className="empty-state glass-card">
              <h3>No accounts yet</h3>
              <p>Create your first account to get started.</p>
            </div>
          ) : (
            accounts.map((account) => (
              <article key={account.id} className="glass-card account-card">
                <div className="card-header-row">
                  <div>
                    <p className="field-label">Account Number</p>
                    <p className="account-number">{account.account_number}</p>
                  </div>

                  <span className="status-pill active">Active</span>
                </div>

                <div className="account-meta">
                  <div>
                    <p className="field-label">Account ID</p>
                    <p className="meta-value">#{account.id}</p>
                  </div>

                  <div>
                    <p className="field-label">Holder</p>
                    <p className="meta-value">{account.holder_name}</p>
                  </div>
                </div>

                <div className="balance-panel">
                  <span>Available balance</span>
                  <strong>₹{Number(account.balance).toFixed(2)}</strong>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectAccount(account.id)}
                  className="secondary-button"
                >
                  View Account
                </button>
              </article>
            ))
          )}
        </section>
      </div>
    </div>
  );
};

export default Accounts;
