const API_URL = import.meta.env.VITE_API_URL;

const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
};

export const createAccount = async (data) => {
  const response = await fetch(`${API_URL}/accounts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return handleResponse(response);
};

export const getBalance = async (accountId) => {
  const response = await fetch(`${API_URL}/accounts/${accountId}/balance`);
  return handleResponse(response);
};

export const getTransactions = async (accountId, page = 1, limit = 10) => {
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  const response = await fetch(
    `${API_URL}/accounts/${accountId}/transactions?${query.toString()}`,
  );
  return handleResponse(response);
};

export const transferMoney = async (data) => {
  const response = await fetch(`${API_URL}/transfers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return handleResponse(response);
};

export const getAccounts = async () => {
  const response = await fetch(`${API_URL}/accounts`);
  return handleResponse(response);
};
