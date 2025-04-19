import React, { useState} from "react";
import logo from '../../img/WhatsApp Image 2025-01-24 at 00.39.45.jpeg';  // Importando a imagem
import {useNavigate } from "react-router-dom";
import "./Login.css";
import axios from "../../axiosConfig";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
  
    const handleLogin = async () => {
      try {
        const response = await axios.post('http://localhost:5000/api/users/login', { // Atualize a porta para 5000
          email,
          password   
        });
        console.log('Response:',response);
        if (response.status === 200) {
          navigate(response.data.redirectUrl);
        } else {
          setError(response.data.error);
        }
      } catch (err) {
        setError("An error occurred. Please try again.");
        console.error("Fetch error:", err);
      }
    };

  
    return (
      <div className="login-container">
        <div className="login-box">
        <div className="login-logo">
          <img src={logo} alt="Logo" className="logo-image" />
        </div>
          {error && <p className="login-error">{error}</p>}
          <input
            type="email"
            placeholder="Email"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
           <button
            type="button"
            className="show-password-button"
            onClick={() => setShowPassword(!showPassword)}
          >
          </button>
          <button className="login-button" onClick={handleLogin}>
            Confirm
          </button>
        </div>
      </div>
    );
  }
  export default Login;