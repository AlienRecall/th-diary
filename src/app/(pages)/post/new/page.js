"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "./../../components/Header";
import Footer from "./../../components/Footer";
import { useAuth } from "./../../context/AuthContext";
import "./new.css";

const NewPostPage = () => {
  const router = useRouter();
  const { token } = useAuth();
  const [title, setTitle] = useState("");
  const [data, setData] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (data.length > 2000) {
      setError("The body cannot exceed 2000 characters.");
      return;
    }

    try {
      const res = await fetch("/api/post/new", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, data }),
      });

      if (!res.ok) {
        setError("Failed to create post.");
        return;
      }

      router.push("/home");
    } catch (err) {
      console.log(err);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  useEffect(() => {
    if (!token)
      router.push("/login");
  }, [token])

  return (
    <div className="container">
      <Header />

      <main className="main-content">
        <h2 className="form-title">Create a New Post</h2>
        <form onSubmit={handleSubmit} className="post-form">
          {error && <p className="error-message">{error}</p>}

          <div className="form-group">
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="body">Body (max 2000 chars):</label>
            <textarea
              id="body"
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="form-input textarea-input"
              rows="10"
              maxLength="2000"
              required
            ></textarea>
          </div>

          <button type="submit" className="submit-button">
            Create Post
          </button>
        </form>
      </main>

      <Footer />
    </div>
  );
};

export default NewPostPage;
