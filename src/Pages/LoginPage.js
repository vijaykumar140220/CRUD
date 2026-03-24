import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // ✅ import CSS

const LoginPage = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleLogin = async () => {
  try {
    const res = await axios.post(
      "http://localhost:5000/auth/login",
      form
    );

    localStorage.setItem("token", res.data.token);
    navigate("/");
  } catch (err) {
    console.error("Login Error:", err); // ✅ FULL ERROR

    // 🔥 Show exact backend message
    if (err.response) {
      console.error("Backend Error:", err.response.data);
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

        {/* Username */}
        <label className="login-label">Username</label>
        <input
          type="text"
          className="login-input"
          placeholder="Email or Phone"
          value={form.username}
          onChange={(e) =>
            setForm({ ...form, username: e.target.value })
          }
        />

        {/* Password */}
        <label className="login-label">Password</label>
        <input
          type="password"
          className="login-input"
          placeholder="Password"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        {/* Login Button */}
        <button className="login-btn" onClick={handleLogin}>
          Log In
        </button>
      </div>
    </div>
  );
};

export default LoginPage;