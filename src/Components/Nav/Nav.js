import React, { useState, useEffect } from "react";
import { FaUser, FaFileAlt, FaClipboardCheck, FaPlus, FaBell, FaSignOutAlt, FaMoneyCheckAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Nav =(props) => {
    const navigate = useNavigate();
    const [userRole, setUserRole] = useState("");

    useEffect(() => {
          const fetchUserRole = async () => {
            try {
              const response = await axios.get('http://localhost:5000/api/users/me', { withCredentials: true });
              setUserRole(response.data.role);
              console.log('User role:', response.data.role);
            } catch (err) {
              console.error("Erro ao obter informações do usuário:", err);
              if (err.response) {
                console.error("Response data:", err.response.data);
                console.error("Response status:", err.response.status);
                console.error("Response headers:", err.response.headers);
              }
              // Redirecionar para a página de login se não estiver autenticado
              navigate("/");
            }
          };
  
      fetchUserRole();
    }, [navigate]);
  

    const handleAddUser = () => {
      if (userRole === "Product Manager") {
        navigate("/newuser");
      } else {
        alert("Access denied. Only Product Managers can add new users.");
      }
    };

    const projects = () => {
      navigate("/projects");
    };
    
    const handleprofile = () => {
      navigate("/profile");
    };

    const handlePayroll = () => {
      if (userRole === "Product Manager") {
        navigate("/payroll");
      } else {
        alert("Access denied. Only Product Managers can access the payroll.");
      }
    };

    return(
        <div className="flex h-screen bg-gray-100">
              {/* Sidebar */}
              <nav className="sidebar">
                <h1>Simple</h1>
                <ul>
                  <li onClick={handleprofile}>
                    <FaUser /> Profile
                  </li>
                  <li>
                    <FaFileAlt /> History
                  </li>
                  <li onClick={projects}>
                    <FaClipboardCheck /> Projects
                  </li>
                  <li onClick={handleAddUser}>
                    <FaUser/><FaPlus /> Users
                  </li>
                  <li>
                    <FaBell /> Notification
                  </li>
                  <li  onClick={handlePayroll}>
                     <FaMoneyCheckAlt/>Payroll
                  </li>
                  <li className='logout' onClick={props.handleLogout}>
                    <FaSignOutAlt/> Logout
                  </li>
                </ul>
              </nav>
       </div> 
    )
};

export default Nav;