"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "./../../context/AuthContext";
import Loader from "./../../components/Loader";
import Header from "./../../components/Header";
import Footer from "./../../components/Footer";
import { format } from "date-fns";
import "./post.css";

const PostPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState(null);

  const getPost = async () => {
    const res = await fetch(`/api/post/${id}`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    if (!res.ok) {
      router.push("/home");
      return;
    }

    const json = await res.json();
    setPost(json.posts[0]);
    setLoading(false);
  };

  const deletePost = async () => {
    const res = await fetch(`/api/post/delete`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ id })
    });

    if (res.ok) {
      router.push("/home");
    } else {
      console.error("Failed to delete the post");
    }
  };

  useEffect(() => {
    if (!token) router.push("/login");
    document.body.style.visibility = "visible";
    getPost();
  }, [router]);

  return (
    loading ? <Loader /> : post ? (
      <div className="container">
        <Header />

        <main className="main-content">
          <div className="post-container">
            <h1 className="post-title">{post.title}</h1>
            <p className="post-text">{post.text}</p>
            <p className="post-created">
              Created at: {format(new Date(post.created_at), "yyyy-MM-dd HH:mm:ss")}
            </p>
            <div className="button-container">
              <button
                className="delete-button"
                onClick={deletePost}
              >
                Delete Post
              </button>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    ) : (
      <p>Post not found.</p>
    )
  );
};

export default PostPage;
