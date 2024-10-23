"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Header from "./../components/Header";
import Footer from "./../components/Footer";
import { useAuth } from "./../context/AuthContext";
import "./account.css";
import { useRouter } from "next/navigation";

const UserProfilePage = () => {
  const router = useRouter();
  const { token, userInfo, setUserInfo } = useAuth();
  const [errMsg, setErrMsg] = useState("");

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/user/picture", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
      },
      body: formData,
    });

    if (!res.ok) {
      alert("Errore nel caricamento dell'immagine.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setUserInfo((prev) => { return { ...prev, pfp: reader.result } });
    };
    reader.readAsDataURL(file);
  };

  const handleSaveChanges = async () => {
    const res = await fetch("/api/user/update", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ first_name: userInfo.firstName, last_name: userInfo.lastName }),
    });

    if (!res.ok)
      alert("Errore while updating profile.");
  };

  const handleDeleteAccount = async () => {
    const res = await fetch("/api/user/delete", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      alert("Error while deleting profile.");
      return;
    }
    router.push("/logout");
  };

  const handleResetImage = async () => {
    const res = await fetch("/api/user/remove-picture", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    if (!res.ok) {
      console.log("error on API call `/api/user/remove-picture`");
      return;
    }

    setUserInfo((prev) => {
      return {
        ...prev,
        pfp: "/uploads/default.png",
      }
    })
  };

  useEffect(() => {
    if (!token)
      router.push("/login");
  }, [token])

  return (
    <div className="container">
      <Header />

      <main className="main-content">
        <h2>Informazioni Utente</h2>
        <div className="profile-form">
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="text"
              id="email"
              value={userInfo.email}
              disabled
            />
          </div>

          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={userInfo.username}
              disabled
            />
          </div>

          <div className="form-group">
            <label htmlFor="first-name">Nome:</label>
            <input
              type="text"
              id="first-name"
              value={userInfo.firstName ? userInfo.firstName : ""}
              placeholder="Insert name"
              onChange={(e) => setUserInfo((prev) => {
                return {
                  ...prev,
                  firstName: e.target.value,
                }
              })}
            />
          </div>

          <div className="form-group">
            <label htmlFor="last-name">Cognome:</label>
            <input
              type="text"
              id="last-name"
              value={userInfo.lastName ? userInfo.lastName : ""}
              placeholder="Insert last name"
              onChange={(e) => setUserInfo((prev) => {
                return {
                  ...prev,
                  lastName: e.target.value,
                }
              })}
            />
          </div>
        </div>

        <div className="account-buttons">
          <button className="save-button" onClick={handleSaveChanges}>
            Salva Modifiche
          </button>
          <button className="delete-account-button" onClick={handleDeleteAccount}>
            Cancella il mio account
          </button>
        </div>

        <h2>Immagine di Profilo</h2>
        <div className="image-upload-section">
          <Image
            src={userInfo.pfp}
            alt="Profile"
            className="profile-preview"
            width={144}
            height={144}
          />
          <div className="image-buttons">
            <input
              type="file"
              accept="image/*"
              id="profile-image"
              onChange={handleImageChange}
              style={{ display: "none" }} // Nascondi il pulsante di input file
            />
            <label htmlFor="profile-image" className="upload-button">
              Carica Immagine
            </label>
            <button className="reset-button" onClick={handleResetImage}>
              Ripristina Immagine
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UserProfilePage;
