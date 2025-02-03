import React from "react";
import { FaSearch, FaUser, FaFileAlt, FaClipboardCheck, FaPlus, FaBell, FaSignOutAlt, FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Nav =(props) => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    const handleAddUser = () => {
      if (user.role === "Product Manager") {
        navigate("/newuser");
      } else {
        alert("Access denied. Only Product Managers can add new users.");
      }
    };

    const projects = () => {
      navigate("/dashboard");
    };
    
    const handleprofile = () => {
      navigate("/profile");
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
                  <li className='logout' onClick={props.handleLogout}>
                    <FaSignOutAlt/> Logout
                  </li>
                </ul>
              </nav>
       </div> 
    )
};

export default Nav;