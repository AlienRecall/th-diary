"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [expires, setExpires] = useState();
  const [token, setToken] = useState();
  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    pfp: "/uploads/default.png",
  });

  const getUser = async () => {
    const res = await fetch("/api/user/me", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
      }
    });

    if (!res.ok)
      return;
    const json = await res.json();
    if (!json.success)
      return;

    const { username, email, first_name, last_name, profile_url } = json.user;
    setUserInfo((prev) => {
      return {
        ...prev,
        username: username,
        email: email,
        firstName: first_name,
        lastName: last_name,
        pfp: profile_url ? "/uploads/" + profile_url : "/uploads/default.png",
      }
    });
  }

  const updateToken = (newToken, expires = null) => {
    setToken(newToken);
    setExpires(expires);
    if (newToken) {
      localStorage.setItem("access_token", newToken);
      localStorage.setItem("session_expires", expires);
    } else {
      localStorage.removeItem("access_token");
      localStorage.removeItem("session_expires");
      router.push("/login");
    }
  };

  const checkExpired = () => {
    if (!expires) return;
    let exp = new Date(expires);
    let now = new Date();
    now.setTime(now.getTime());
    if (exp && exp < now) {
      console.log("session expired...");

      updateToken(null);
      router.push("/login");
      router.refresh();
    }
  }

  useEffect(() => {
    setToken(localStorage.getItem("access_token"));
    setExpires(localStorage.getItem("session_expires"));

    checkExpired();
    if (token)
      getUser();
  }, [token, expires]);

  return (
    <AuthContext.Provider value={{ token, setToken: updateToken, userInfo, setUserInfo }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);