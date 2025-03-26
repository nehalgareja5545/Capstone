import "./App.css";
import Dashboard from "./pages/Dashboard/Dashboard";
import GroupPage from "./pages/Group/Group";
import ExpensePage from "./pages/Expense/Expense";
import BalancesPage from "./pages/Balance/Balance";
import LoginRegistrationPage from "./pages/Login/login";
import { Routes, Route } from "react-router";
import Notification from "./pages/Notification/Notification";
import GroupDetails from "./pages/GroupDetails/GroupDetails";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<LoginRegistrationPage />} />
        <Route path="/group" element={<GroupPage />} />
        <Route path="/groupDetails/:groupId" element={<GroupDetails />} />
        <Route path="/expense" element={<ExpensePage />} />
        <Route path="/balance" element={<BalancesPage />} />
        <Route path="/notification" element={<Notification />} />
      </Routes>
    </div>
  );
}

export default App;
