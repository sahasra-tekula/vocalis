import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

  const handleLogin = (name, avatar) => {
    const newUser = { name, avatar };
    setUser(newUser);
    localStorage.setItem("vocalisUser", JSON.stringify(newUser));
    setCurrentScreen("MENU");
  };

  const handleStartChallenge = () => setCurrentScreen("LEVEL_SELECT");
  const handleShowProgress = () => setCurrentScreen("PROGRESS");
  const handleGoToMenu = () => setCurrentScreen("MENU");

  const handleSelectLevel = (levelId) => {
    setSelectedLevel(levelId);
    setCurrentScreen("CHALLENGE");
  };

  // ⚡️ FAST SETTINGS ⚡️
  const pageTransition = {
    type: "spring",
    stiffness: 300, // ⬆️ Increased from 50 to 300 (Much faster)
    damping: 25     // ⬆️ Keeps it tight so it doesn't wobble
  };

  const pageVariants = {
    initial: { opacity: 0, x: 20 }, // Slide from right (looks faster than up)
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -20 }
  };

  return (
    <div className="App">
      <AnimatePresence mode="wait">
        
        {currentScreen === "PROFILE" && (
          <motion.div key="profile" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} style={{ width: '100%', position: 'absolute' }}>
            <ProfileScreen onLogin={handleLogin} />
          </motion.div>
        )}

        {currentScreen === "MENU" && (
          <motion.div key="menu" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} style={{ width: '100%', position: 'absolute' }}>
            <MainMenu
              user={user}
              onStartChallenge={handleStartChallenge}
              onShowProgress={handleShowProgress}
            />
          </motion.div>
        )}

        {currentScreen === "LEVEL_SELECT" && (
          <motion.div key="level" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} style={{ width: '100%', position: 'absolute' }}>
            <LevelSelect
              onSelectLevel={handleSelectLevel}
              onGoToMenu={handleGoToMenu}
            />
          </motion.div>
        )}

        {currentScreen === "CHALLENGE" && (
          <motion.div key="challenge" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} style={{ width: '100%', position: 'absolute' }}>
            <ChallengeScreen
              onGoToMenu={handleGoToMenu}
              onGoToProgress={handleShowProgress}
              selectedLevel={selectedLevel}
            />
          </motion.div>
        )}

        {currentScreen === "PROGRESS" && (
          <motion.div key="progress" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} style={{ width: '100%', position: 'absolute' }}>
            <ProgressScreen onGoToMenu={handleGoToMenu} />
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}

export default App;
