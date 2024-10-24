"use client";

import React, { useEffect } from "react";
import Loader from "./(pages)/components/Loader";
import { useAuth } from "./(pages)/context/AuthContext";
import { useRouter } from "next/navigation";

const HomePage = () => {
  const router = useRouter();
  const { token } = useAuth();

  useEffect(() => {
    if (!token) {
      router.push("/login");
    } else {
      router.push("/home");
    }
  }, [token, router]);

  return (
    <div className="container">
      <Loader />
    </div>
  );
};

export default HomePage;
