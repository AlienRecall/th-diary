"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Loader from "./../components/Loader";
import Footer from "./../components/Footer";
import { useAuth } from "./../context/AuthContext";
import "./login.css";

const LoginPage = () => {
  const router = useRouter();
  const { token, setToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    if (token)
      router.push("/account");

    document.body.style.visibility = "visible";
    setLoading(false);
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/user/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: email, password: password }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        console.log(json);
        if (json.error) setErrMsg(json.error);
        return;
      }

      setToken(json.token, json.expires);
      router.push("/home");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    loading ? <Loader /> : <div className="container">
      <main className="main-content">
        <h2 className="form-title">Login</h2>
        {errMsg && <p className="error-message">{errMsg}</p>}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Username or email:</label>
            <input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
            />
          </div>
          <button type="submit" className="submit-button">
            Login
          </button>
        </form>

        <p className="signup-text">
          Don&apos;t have an account? <a href="/signup">Signup</a>.
        </p>
      </main>

      <Footer />
    </div>
  );
};

export default LoginPage;
