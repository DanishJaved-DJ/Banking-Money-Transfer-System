import { useState } from "react";
import Accounts from "./pages/Accounts";
import Dashboard from "./pages/Dashboard";

function App() {

    const [selectedAccountId, setSelectedAccountId] = useState(null);

    if (!selectedAccountId) {
        return (
            <Accounts
                onSelectAccount={setSelectedAccountId}
            />
        );
    }

    return (
        <Dashboard
            accountId={selectedAccountId}
            onBack={() => setSelectedAccountId(null)}
        />
    );
}

export default App;