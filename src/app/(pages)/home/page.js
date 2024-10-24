"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./../context/AuthContext";
import Loader from "./../components/Loader";
import Header from "./../components/Header";
import Footer from "./../components/Footer";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import "./home.css";

const Home = () => {
  const router = useRouter();
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  const getPosts = async () => {
    const res = await fetch("/api/post/all", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    if (!res.ok)
      return;

    const json = await res.json();
    setPosts(json.posts);
    setLoading(false);
  };

  const deletePost = async (id) => {
    const res = await fetch("/api/post/delete", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-type": "application/json"
      },
      body: JSON.stringify({ id })
    });

    if (!res.ok)
      return;
    setPosts(posts.filter((post) => post.id !== id));
    getPosts();
  }

  useEffect(() => {
    if (!token)
      router.push("/login");
    document.body.style.visibility = "visible";
    getPosts();
  }, [router]);

  const formatDate = (d) => {
    const gmtDate = new Date(d);
    const localDate = new Date(gmtDate.getTime() - gmtDate.getTimezoneOffset() * 60000);
    return formatDistanceToNow(localDate, { addSuffix: true })
  }

  return (
    loading ? <Loader /> : <div className="container">
      <Header />

      <main className="main-content">
        <div className="posts-container">
          {posts.length ? (
            posts.map((post) => (
              <div key={post.id} className="post">
                <Link href={"/post/" + post.id}>
                  <h2 className="post-title">{post.title}</h2>
                </Link>
                <p className="post-content">{post.text.length > 60 ? post.text.substr(0, 60) + "..." : post.text}</p>
                <p className="post-created">{formatDate(post.created_at)}</p>
                <button className="delete-button" onClick={() => deletePost(post.id)}>
                  Delete
                </button>
              </div>
            ))
          ) : (
            <Link href="/post/new"><p>Create your first post!</p></Link>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
