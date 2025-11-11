import React, { useEffect, useState } from "react";
import "./App.css";

function ProgressScreen({ onGoToMenu }) {
  const [progress, setProgress] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("vocalisProgress")) || [];
    setProgress(stored);
  }, []);

  const mastered = progress.filter((w) => w.mastered);
  const practiceLater = progress.filter((w) => !w.mastered);

  const avg =
    progress.length > 0
      ? Math.round(progress.reduce((a, b) => a + b.accuracy, 0) / progress.length)
      : 0;

  const clearProgress = () => {
    localStorage.removeItem("vocalisProgress");
    setProgress([]);
  };

  return (
    <div className="App-header">
      <button onClick={onGoToMenu} className="back-btn">⬅ Menu</button>
      <h1>📊 Your Progress</h1>

      <div className="progress-summary">
        <p>Average Accuracy: <strong>{avg}%</strong></p>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${avg}%` }}
          ></div>
        </div>
      </div>

      <div className="progress-section">
        <h3>⭐ Mastered Words</h3>
        {mastered.length > 0 ? (
          <ul>{mastered.map((w) => <li key={w.word}>{w.word}</li>)}</ul>
        ) : <p>None yet — keep practicing!</p>}
      </div>

      <div className="progress-section">
        <h3>🔁 Practice Later</h3>
        {practiceLater.length > 0 ? (
          <ul>{practiceLater.map((w) => <li key={w.word}>{w.word}</li>)}</ul>
        ) : <p>No words to practice later!</p>}
      </div>

      <button onClick={clearProgress} className="clear-button">
        Clear Progress
      </button>
    </div>
  );
}

export default ProgressScreen;
