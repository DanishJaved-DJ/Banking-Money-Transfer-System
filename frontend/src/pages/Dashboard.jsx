import { useEffect, useState } from "react";
import { getBalance, getTransactions, transferMoney } from "../services/api";

const Dashboard = ({ accountId, onBack }) => {
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    total: 0,
    totalPages: 1,
  });
  const [pageSize, setPageSize] = useState(5);

  const [toAccountId, setToAccountId] = useState("");
  const [amount, setAmount] = useState("");

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  const loadAccountData = async (page = 1, limit = pageSize) => {
    setPageLoading(true);

    try {
      const balanceResponse = await getBalance(accountId);
      const transactionResponse = await getTransactions(accountId, page, limit);

      setAccount(balanceResponse?.data || null);
      setTransactions(transactionResponse?.data?.transactions || []);
      setPagination(
        transactionResponse?.data?.pagination || {
          page,
          limit,
          total: 0,
          totalPages: 1,
        },
      );
    } catch (error) {
      console.error(error);
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    loadAccountData(1, pageSize);
  }, [accountId, pageSize]);

  const handleTransfer = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setMessageType("success");

    try {
      const response = await transferMoney({
        fromAccountId: Number(accountId),
        toAccountId: Number(toAccountId),
        amount: Number(amount),
      });

      setMessage(response?.message || "Transfer successful");
      setToAccountId("");
      setAmount("");
      await loadAccountData(1, pageSize);
    } catch (error) {
      console.error(error);
      setMessage(error?.message || "Transfer failed");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="banking-shell">
      <div className="container-shell dashboard-shell">
        <button type="button" onClick={onBack} className="back-button">
          ← Back to Accounts
        </button>

        <header className="page-header dashboard-header">
          <div>
            <p className="eyebrow">Account overview</p>
            <h1>Account Dashboard</h1>
          </div>
        </header>

        {account && (
          <section className="glass-card summary-card">
            <div>
              <p className="field-label">Account Number</p>
              <p className="account-number large">{account.accountNumber}</p>
            </div>

            <div className="balance-block">
              <p className="field-label">Current Balance</p>
              <p className="balance-value">
                ₹{Number(account.balance).toFixed(2)}
              </p>
            </div>
          </section>
        )}

        <div className="dashboard-grid">
          <section className="glass-card transfer-panel">
            <div className="section-header">
              <h2>Transfer Money</h2>
            </div>

            <form onSubmit={handleTransfer} className="transfer-form">
              <label>
                <span>To Account</span>
                <input
                  type="number"
                  value={toAccountId}
                  onChange={(e) => setToAccountId(e.target.value)}
                  className="form-field"
                  placeholder="Enter account ID"
                  required
                />
              </label>

              <label>
                <span>Amount</span>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="form-field"
                  placeholder="Enter amount"
                  required
                />
              </label>

              <button
                type="submit"
                className="primary-button"
                disabled={loading}
              >
                {loading ? "Processing..." : "Transfer"}
              </button>
            </form>

            {message && (
              <p
                className={`feedback-message ${messageType === "error" ? "error" : "success"}`}
              >
                {message}
              </p>
            )}
          </section>

          <section className="glass-card transactions-panel">
            <div className="section-header split-header">
              <h2>Transaction History</h2>

              <label className="page-size-select">
                <span>Rows</span>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </label>
            </div>

            {pageLoading ? (
              <div className="transaction-list">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="transaction-row skeleton-row">
                    <div className="skeleton-line medium" />
                    <div className="skeleton-line small" />
                    <div className="skeleton-line short" />
                  </div>
                ))}
              </div>
            ) : transactions.length === 0 ? (
              <div className="empty-state compact">
                <h3>No transactions yet</h3>
                <p>Recent account activity will appear here.</p>
              </div>
            ) : (
              <div className="transaction-list">
                {transactions.map((transaction) => {
                  const isDebit =
                    Number(transaction.from_account_id) === Number(accountId);

                  return (
                    <div key={transaction.id} className="transaction-row">
                      <div>
                        <p
                          className={`transaction-type ${isDebit ? "debit" : "credit"}`}
                        >
                          {isDebit ? "DEBIT" : "CREDIT"}
                        </p>
                        <p className="transaction-ref">
                          Ref: {transaction.transaction_ref}
                        </p>
                      </div>

                      <div className="transaction-amount-block">
                        <p className="amount">
                          ₹{Number(transaction.amount).toFixed(2)}
                        </p>
                        <p className="status-text">{transaction.status}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {pagination.totalPages > 1 && (
              <div className="pagination-row">
                <button
                  type="button"
                  disabled={pagination.page <= 1}
                  onClick={() => loadAccountData(pagination.page - 1, pageSize)}
                  className="secondary-button compact"
                >
                  Previous
                </button>

                <p>
                  Page {pagination.page} of {pagination.totalPages}
                </p>

                <button
                  type="button"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => loadAccountData(pagination.page + 1, pageSize)}
                  className="secondary-button compact"
                >
                  Next
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
