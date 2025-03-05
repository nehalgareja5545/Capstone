import "./App.css";
import Dashboard from "./pages/Dashboard/Dashboard";
import LoginRegistrationPage from "./pages/Login/login";
import { Routes, Route } from "react-router";
import GroupPage from "./pages/Group/Group";
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
      </Routes>
    </div>
  );
}

export default App;
