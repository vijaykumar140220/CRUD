import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import "./Login.css"; 

const LoginPage = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/auth/login", form);
      const token = res.data.access_token;

      if (token) {
        const currentTime = new Date().getTime(); // Get current time in ms
        
        // 1. Save Token and Timestamp to LocalStorage
        localStorage.setItem("token", token);
        localStorage.setItem("loginTimestamp", currentTime.toString());

        // 2. Update Redux
        dispatch({ type: "LOGIN_SUCCESS", payload: token });

        // 3. Move to Home
        navigate("/");
      } else {
        alert("Token not received from server");
      }
    } catch (err) {
      if (err.response) {
        alert(err.response.data.message || "Login Failed");
      } else {
        alert("Server not reachable");
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Login Here</h2>
        <label className="login-label">Username</label>
        <input
          type="text"
          className="login-input"
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        <label className="login-label">Password</label>
        <input
          type="password"
          className="login-input"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button className="login-btn" onClick={handleLogin}>Log In</button>
      </div>
    </div>
  );
};

export default LoginPage;