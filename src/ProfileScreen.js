// src/ProfileScreen.js
import React, { useState } from "react";
import "./App.css";

function ProfileScreen({ onLogin }) {
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("🦜");

  const avatars = ["🦜", "🐼", "🦊", "🐯", "🐸", "🐰", "🐻", "🐶", "🐧"];

  const handleSubmit = (e) => {
    e.preventDefault();

    if (name.trim() === "") {
      alert("Please enter your name!");
      return;
    }

    onLogin(name.trim(), avatar);
  };

  return (
    <header className="App-header">
      <h1>🗣️ Welcome to Vocalis!</h1>
      <p>Let’s create your speech buddy profile 💬</p>

      <form onSubmit={handleSubmit} className="profile-form">
        <div className="input-group">
          <label>Your Name:</label>
          <input
            type="text"
            value={name}
            placeholder="Enter your name"
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Choose Your Avatar:</label>
          <div className="avatar-grid">
            {avatars.map((icon) => (
              <span
                key={icon}
                className={`avatar-option ${avatar === icon ? "selected" : ""}`}
                onClick={() => setAvatar(icon)}
              >
                {icon}
              </span>
            ))}
          </div>
        </div>

        <button type="submit" className="start-button">
          🚀 Start
        </button>
      </form>
    </header>
  );
}

export default ProfileScreen;
