import React from "react";
import { FaSearch, FaUser, FaFileAlt, FaClipboardCheck, FaPlus, FaBell, FaSignOutAlt, FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Nav =(props) => {
    const navigate = useNavigate();

    const handleAddUser = () => {
      navigate("/newUser");
    };
    const projects = () => {
      navigate("/dashboard");
    };
    return(
        <div className="flex h-screen bg-gray-100">
              {/* Sidebar */}
              <nav className="sidebar">
                <h1>Simple</h1>
                <ul>
                  <li>
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