"use client";

import React, { useEffect } from "react";
import Loader from "./../components/Loader";
import { useAuth } from "./../context/AuthContext";
import { useRouter } from "next/navigation";

const HomePage = () => {
  const router = useRouter();
  const { setToken } = useAuth();

  useEffect(() => {
    setToken(null);
    router.push("/login");
    router.refresh();
  }, [setToken, router]);

  return (
    <div className="container">
      Logging you out...
      <Loader />
    </div>
  );
};

export default HomePage;
