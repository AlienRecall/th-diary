"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Loader from "./../components/Loader";
import Footer from "./../components/Footer";
import { useAuth } from "./../context/AuthContext";
import "./signup.css";

const SignupPage = () => {
  const router = useRouter();
  const { token, setToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
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
      const res = await fetch("/api/user/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, username, password }),
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
      return;
    }
  };

  return (
    loading ? <Loader /> : <div className="container">
      <main className="main-content">
        <h2 className="form-title">Signup</h2>
        {errMsg && <p className="error-message">{errMsg}</p>}
        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
            Signup
          </button>
        </form>

        <p className="signin-text">
          Already have an account? <a href="/login">Signin</a>.
        </p>
      </main>

      <Footer />
    </div>
  );
};

export default SignupPage;
