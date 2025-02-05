import "./App.css";
import Dashboard from "./pages/Dashboard/Dashboard";
import LoginRegistrationPage from "./pages/Login/login";
import { Routes, Route } from "react-router";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<LoginRegistrationPage />} />
      </Routes>
    </div>
  );
}

export default App;
