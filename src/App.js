import React from "react";
import Dashboard from "./Components/pages/Dashboard"; // Ajuste o caminho para o componente principal
import Login from "./Components/Login/Login"; // Ajuste o caminho para o componente de login
import Profile from "./Components/Profile/Profile"; // Ajuste o caminho para o componente de perfil
import Payroll from "./Components/Payroll/Payroll"; // Ajuste o caminho para o componente de folha de pagamento
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import NewUser from "./Components/NewUser/NewUser";
import ProjectDetails from "./Components/ProjectsDetails/ProjectsDetails";
import Register from "./Components/Register/Register";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/projects" element={<Dashboard />} />
        <Route path="/newUser" element={<NewUser />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/payroll" element={<Payroll />} />
        <Route path="/project/:id" element={<ProjectDetails/>}/>
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
