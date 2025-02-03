import React from "react";
import Dashboard from "./Components/pages/Dashboard"; // Ajuste o caminho para o componente principal
import Login from "./Components/Login/Login"; // Ajuste o caminho para o componente de login
import Profile from "./Components/Profile/Profile"; // Ajuste o caminho para o componente de perfil
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import NewUser from "./Components/NewUser/NewUser";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/newUser" element={<NewUser />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
