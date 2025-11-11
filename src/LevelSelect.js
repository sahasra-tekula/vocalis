// src/LevelSelect.js
import React from "react";
import "./App.css";

function LevelSelect({ onSelectLevel, onGoToMenu }) {
  const levels = [
    {
      id: 1,
      name: "Level 1: Small Words",
      description: "Start with simple, single-syllable words.",
      color: "#FFD36B",
    },
    {
      id: 2,
      name: "Level 2: Complex Words",
      description: "Practice longer and trickier words.",
      color: "#B6E388",
    },
    {
      id: 3,
      name: "Level 3: Sentences",
      description: "Try full sentences for fluency and flow.",
      color: "#A2D2FF",
    },
  ];

  return (
    <div className="App-header">
      <button onClick={onGoToMenu} className="back-btn">⬅ Menu</button>
      <h1>🎯 Choose a Level</h1>
      <div className="level-grid">
        {levels.map((level) => (
          <div
            key={level.id}
            className="level-card"
            style={{ backgroundColor: level.color }}
          >
            <h2>{level.name}</h2>
            <p>{level.description}</p>
            <button
              className="start-level-btn"
              onClick={() => onSelectLevel(level.id)}
            >
              Start 🚀
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LevelSelect;
