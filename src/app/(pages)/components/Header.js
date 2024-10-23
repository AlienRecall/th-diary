"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "./../context/AuthContext";

const Header = () => {
  const { userInfo } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleClickOutside = (event) => {
    if (
      showDropdown &&
      !event.target.closest(".profile-icon") &&
      !event.target.closest(".dropdown-menu")
    ) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showDropdown]);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <header className="header">
      <Link href="/home"><h1 className="title">My Diary</h1></Link>
      <div className="header-actions">
        <Link href="/post/new" className="new-post-button">
          <Image
            src="/icons/new-note.png"
            alt="New Post"
            width={24}
            height={24}
          />
          <span>New Post</span>
        </Link>
        <div className="profile-icon" onClick={toggleDropdown}>
          <Image src={userInfo.pfp} alt="Profile Icon" width={144} height={144} />
          {showDropdown && (
            <div className="dropdown-menu">
              <Link href="/account">Account</Link>
              <Link href="/logout">Logout</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
