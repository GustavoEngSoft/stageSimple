import React, { useState, useEffect } from "react";
import { FaPen, FaEye, FaEyeSlash } from "react-icons/fa";
import Nav from "../Nav/Nav";
import './Profile.css';
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    dateOfBirth: "",
    ssn: "",
    role: "",
    photo: ""
  });
  const [isEditing, setIsEditing] = useState({
    email: false,
    password: false,
    photo: false
  });
  const [hasChanges, setHasChanges] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true); // Estado de carregamento
  const [error, setError] = useState(null); // Estado de erro

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/me');
        setUser(response.data);
        setLoading(false);
        console.log('Response:', response);
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
        setError(error.message);
        setLoading(false);
      }
    };


    fetchUserData();
  }, []);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
    setHasChanges(true);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setUser({ ...user, photo: reader.result });
      setHasChanges(true);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  
  const handleSave = async () => {
    if (hasChanges) {
      try {
        await axios.put('http://localhost:5000/api/users/mE', user);
        console.log('Dados do usuário atualizados com sucesso');
        setHasChanges(false);
      } catch (error) {
        console.error("Erro ao salvar dados do usuário:", error);
      }
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  if (loading) {
    alert('Carregando...');
  }

  if (error) {
    return <div>Erro: {error}</div>;
  }
  return (
    <div>
      <Nav handleLogout={handleLogout}/>
      <main className="profileContainer">
        <div className="profilePhoto">
          {user.photo ? (
            <img src={user.photo} alt="User" className="photoPreview" />
          ) : (
            <div className="photoPlaceholder">Upload Photo</div>
          )}
          <input
            type="file"
            onChange={handlePhotoChange}
          />
        <FaPen onClick={() => setIsEditing({ ...isEditing, photo: !isEditing.photo })} />
        </div>
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
            <input placeholder= 'Date of birth' type="date" value={user.dateOfBirth} readOnly />
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