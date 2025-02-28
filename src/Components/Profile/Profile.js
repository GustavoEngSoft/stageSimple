import React, { useState, useEffect } from "react";
import { FaPen, FaEye, FaEyeSlash } from "react-icons/fa";
import Nav from "../Nav/Nav";
import './Profile.css';
import { useNavigate } from "react-router-dom";
import axios from "../../axiosConfig";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    birthdate: "",
    ssn: "",
    role: "",
  });
  const [isEditing, setIsEditing] = useState({
    email: false,
    password: false,
  });
  const [hasChanges, setHasChanges] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null); // Estado de erro

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/me');
        const userData = response.data;
        // Converter a data de nascimento para o formato yyyy-MM-dd
        if (userData.birthdate) {
          userData.birthdate = new Date(userData.birthdate).toISOString().split('T')[0];
        }
        setUser(userData);
        console.log('Response:', response);
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
        setError(error.message);
      }
    };


    fetchUserData();
  }, []);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
    setHasChanges(true);
  };


  
  const handleSave = async () => {
    if (hasChanges) {
      try {
        await axios.put('http://localhost:5000/api/users/me', user);
        console.log('Dados do usuário atualizados com sucesso');
        setHasChanges(false);
      } catch (error) {
        console.error("Erro ao salvar dados do usuário:", error);
      }
    }
  };
  
  const handleLogout = () => {
    // Limpar o cookie da sessão
    document.cookie = "connect.sid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate("/");
  };


  if (error) {
    return <div>Erro: {error}</div>;
  }
  return (
    <div>
      <Nav handleLogout={handleLogout}/>
      <main className="profileContainer">
        <h2 class='profileUser'>Profile</h2>
        <div className="profileInfo">
          <div className="profileField">
            <input type="textProfile" value={user.name} readOnly />
          </div>
          <div className="profileField">
            <input
              placeholder="Email"
              type="email"
              name="email"
              value={user.email}
              readOnly={!isEditing.email}
              onChange={handleInputChange}
            />
            <FaPen onClick={() => setIsEditing({ ...isEditing, email: !isEditing.email })} />
          </div>
          <div className="profileField">
            <input
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={user.password}
              readOnly={!isEditing.password}
              onChange={handleInputChange}
            />
            <FaPen onClick={() => setIsEditing({ ...isEditing, password: !isEditing.password })} />
            {showPassword ? (
              <FaEyeSlash onClick={() => setShowPassword(false)} />
            ) : (
              <FaEye onClick={() => setShowPassword(true)} />
            )}
          </div>
          <div className="profileField">
            <input placeholder= 'Date of birth' type="date" name= "birthdate" value={user.birthdate} readOnly />
          </div>
          <div className="profileField">
            <input placeholder='SSN' type="textProfile" value={user.ssn} readOnly />
          </div>
          <div className="profileField">
            <input placeholder="ROLE" type="textProfile" value={user.role} readOnly />
          </div>
          <button
            className={`save-button ${hasChanges ? "active" : "disabled"}`}
            onClick={handleSave}
            disabled={!hasChanges}
          >
            Save
          </button>
        </div>
      </main>
    </div>
  );
};

export default Profile;