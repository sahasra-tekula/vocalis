import React, { useState, useEffect } from "react";
import "./App.css";
import ProfileScreen from "./ProfileScreen";
import MainMenu from "./MainMenu";
import ChallengeScreen from "./ChallengeScreen";
import ProgressScreen from "./ProgressScreen";
import LevelSelect from "./LevelSelect";

function App() {
  const [currentScreen, setCurrentScreen] = useState("PROFILE");
  const [user, setUser] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(1);

  useEffect(() => {
    const savedUser = localStorage.getItem("vocalisUser");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setCurrentScreen("MENU");
    }
  }, []);

  // 🔹 Login
  const handleLogin = (name, avatar) => {
    const newUser = { name, avatar };
    setUser(newUser);
    localStorage.setItem("vocalisUser", JSON.stringify(newUser));
    setCurrentScreen("MENU");
  };

  // 🔹 Menu actions
  const handleStartChallenge = () => setCurrentScreen("LEVEL_SELECT");
  const handleShowProgress = () => setCurrentScreen("PROGRESS");
  const handleGoToMenu = () => setCurrentScreen("MENU");

  // 🔹 Level selection
  const handleSelectLevel = (levelId) => {
    setSelectedLevel(levelId);
    setCurrentScreen("CHALLENGE");
  };

  return (
    <div className="App">
      {currentScreen === "PROFILE" && <ProfileScreen onLogin={handleLogin} />}

      {currentScreen === "MENU" && (
        <MainMenu
          user={user}
          onStartChallenge={handleStartChallenge}
          onShowProgress={handleShowProgress}
        />
      )}

      {currentScreen === "LEVEL_SELECT" && (
        <LevelSelect
          onSelectLevel={handleSelectLevel}
          onGoToMenu={handleGoToMenu}
        />
      )}

      {currentScreen === "CHALLENGE" && (
        <ChallengeScreen
          onGoToMenu={handleGoToMenu}
          onGoToProgress={handleShowProgress} // ✅ Fixed navigation
          selectedLevel={selectedLevel}
        />
      )}

      {currentScreen === "PROGRESS" && (
        <ProgressScreen onGoToMenu={handleGoToMenu} />
      )}
    </div>
  );
}

export default App;
