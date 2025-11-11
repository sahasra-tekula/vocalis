// src/MainMenu.js
import React from 'react';

function MainMenu({ user, onStartChallenge, onShowProgress }) {
  return (
    <header className="App-header">
      {/* user will never be null here, but good practice to check */}
      <h1>Hi, {user?.name}! {user?.avatar}</h1>
      <p>What would you like to do?</p>
      
      <div style={{ display: 'flex', gap: '20px' }}>
        <button 
          onClick={onStartChallenge}
          style={{ fontSize: '24px', padding: '20px' }}
        >
          🎯 Start Challenge
        </button>
        <button 
          onClick={onShowProgress}
          style={{ fontSize: '24px', padding: '20px' }}
        >
          📊 Track Progress
        </button>
      </div>
    </header>
  );
}

export default MainMenu;