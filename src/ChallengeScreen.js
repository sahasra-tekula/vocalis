import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import Confetti from "react-confetti";
import { motion, AnimatePresence } from "framer-motion"; // <-- FIXED!
import { useWindowSize } from "react-use";

function ChallengeScreen({ onGoToMenu, onGoToProgress, selectedLevel }) {
  const { width, height } = useWindowSize();
  const canvasRef = useRef(null);

  // Word lists
  const levels = {
    1: ["SUN", "CAT", "DOG", "BALL"],
    2: ["APPLE", "TIGER", "FLOWER", "BANANA"],
    3: ["THE CAT IS SLEEPING", "I LIKE ICE CREAM", "THE SUN IS BRIGHT", "DOGS LOVE BONES"],
  };
  
  // 🔥 TIME ATTACK STATE
  const [isTimeAttack, setIsTimeAttack] = useState(selectedLevel === "TIME_ATTACK");
  const [timer, setTimer] = useState(60);
  const [score, setScore] = useState(0);
  const [timeAttackOver, setTimeAttackOver] = useState(false);
  const timeAttackWords = [...levels[1], ...levels[2]]; // Use simple words

  // Normal Level State
  const [currentLevel, setCurrentLevel] = useState(selectedLevel);
  // Handle TIME_ATTACK case for initial state
  const [words, setWords] = useState(isTimeAttack ? [] : levels[selectedLevel]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentWord, setCurrentWord] = useState(isTimeAttack ? "Get Ready!" : words[0]);

  // Shared State
  const [feedback, setFeedback] = useState("");
  const [encouragement, setEncouragement] = useState("");
  const [accuracyValue, setAccuracyValue] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [showHearIt, setShowHearIt] = useState(false);
  const [isAfterHear, setIsAfterHear] = useState(false);
  const [stars, setStars] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [mediaStream, setMediaStream] = useState(null);
  const [combo, setCombo] = useState(0);

  const encouragements = [
    "You’re doing great! Let’s try once more 💪",
    "Almost there — you’ve got this 🌟",
    "Keep going, I believe in you! 😊",
  ];

  // 🔊 SOUND EFFECTS
  const playSound = (type) => {
    const sounds = {
      success: new Audio("https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3"),
      retry: new Audio("https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3"),
      complete: new Audio("https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3"),
      combo: new Audio("https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3"), 
    };

    if (sounds[type]) {
      sounds[type].volume = 0.5;
      sounds[type].play().catch((e) => console.warn("Audio play failed", e));
    }
  };

  // 🎵 VISUALIZER
  useEffect(() => {
    if (!mediaStream || !canvasRef.current) return;

    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioCtx.createMediaStreamSource(mediaStream);
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 64; 
    source.connect(analyser);

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationId;

    const draw = () => {
      animationId = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const barWidth = (canvas.width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] / 2;
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, "#ff7b00");
        gradient.addColorStop(1, "#ffd36b");

        ctx.fillStyle = gradient;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 2;
      }
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      if (audioCtx.state !== 'closed') audioCtx.close();
    };
  }, [mediaStream]);

  // 🎉 CONFETTI
  useEffect(() => {
    let timer;
    if (showConfetti) timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, [showConfetti]);

  // 🔥 TIMER / GAME SETUP EFFECT
  useEffect(() => {
    if (isTimeAttack) {
      // TIME ATTACK MODE
      setFeedback("Get ready! Say the word!");
      setCurrentWord(timeAttackWords[Math.floor(Math.random() * timeAttackWords.length)]);
      
      const interval = setInterval(() => {
        setTimer((t) => {
          if (t <= 1) {
            clearInterval(interval);
            setTimeAttackOver(true); // GAME OVER
            return 0;
          }
          return t - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    } else {
      // NORMAL LEVEL MODE
      if (selectedLevel && levels[selectedLevel]) {
        setCurrentLevel(selectedLevel);
        setWords(levels[selectedLevel]);
        setCurrentIndex(0);
        setCurrentWord(levels[selectedLevel][0]);
        setFeedback("");
        setStars(0);
        setRetryCount(0);
        setCombo(0);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTimeAttack, selectedLevel]);


  const saveProgress = (word, accuracy, level) => {
    if (isTimeAttack) return; // Don't save progress in Time Attack
    const mastered = accuracy >= 80;
    const stored = JSON.parse(localStorage.getItem("vocalisProgress")) || [];
    const existingIndex = stored.findIndex((w) => w.word === word);
    const entry = { word, accuracy, mastered, level, date: new Date().toISOString() };

    if (existingIndex !== -1) stored[existingIndex] = entry;
    else stored.push(entry);

    localStorage.setItem("vocalisProgress", JSON.stringify(stored));
  };

  const computeAccuracy = (spoken, expected) => {
    spoken = spoken.toUpperCase().replace(/[^A-Z ]/g, "");
    expected = expected.toUpperCase().replace(/[^A-Z ]/g, "");
    if (!spoken) return 0;
    if (spoken === expected) return 100;

    let match = 0;
    const len = Math.max(spoken.length, expected.length);
    for (let i = 0; i < expected.length; i++) if (spoken[i] === expected[i]) match++;
    const raw = Math.round((match / len) * 100);
    if (raw >= 70 && Math.abs(spoken.length - expected.length) <= 1)
      return Math.min(100, raw + 20);
    return raw;
   };

  const sendToDeepgram = async (audioBlob) => {
    if (timeAttackOver) return; 
    try {
      const formData = new FormData();
      formData.append('audioBlob', audioBlob, 'speech.webm');
      formData.append('text', currentWord);

      const res = await fetch("http://localhost:3001/api/check-speech", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      const spoken = data.results.channels[0].alternatives[0].transcript || "";
      const conf = data.results.channels[0].alternatives[0].confidence || 0;
      const acc = computeAccuracy(spoken, currentWord);
      const overall = Math.round(conf * 50 + acc * 0.5);
      setAccuracyValue(overall);
      handleResult(overall);
    } catch {
      setFeedback("⚠️ Error. Try again!");
    }
  };

  const handleMicClick = async () => {
    if (isRecording || timeAttackOver) return;
    setIsRecording(true);
    setFeedback(`🎙️ Listening... say "${currentWord}"`);
    setEncouragement("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMediaStream(stream);

      const recorder = new MediaRecorder(stream);
      const chunks = [];
      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: "audio/webm" });
        stream.getTracks().forEach((t) => t.stop());
        setMediaStream(null);
        setFeedback("Analyzing...");
        await sendToDeepgram(audioBlob);
        setIsRecording(false);
      };
      recorder.start();
      setTimeout(() => recorder.stop(), 2000);
    } catch {
      setFeedback("🎤 Microphone not accessible.");
      setIsRecording(false);
    }
  };

  const handleResult = (acc) => {
    if (acc >= 80) {
      // CORRECT
      playSound("success");
      setFeedback("🌟 Great!");
      setStars(3);
      setCombo((c) => c + 1);

      if (isTimeAttack) {
        setTimer((t) => t + 2); // +2 seconds!
        setScore((s) => s + 100 + (combo * 10)); // Bonus points for combo
        setTimeout(loadNextWord, 400); // Rapid-fire next word
      } else {
        setEncouragement("");
        setShowConfetti(true);
        setTimeout(() => nextWord(), 2500); // Normal delay
      }
      
    } else {
      // WRONG
      playSound("retry");
      setFeedback("💬 Try again!");
      setStars(acc > 50 ? 2 : acc > 0 ? 1 : 0);
      setCombo(0); // COMBO BREAKER

      if (isTimeAttack) {
        setTimeout(loadNextWord, 800); // Move on, but slightly slower
      } else {
        // Normal retry logic
        const newRetry = retryCount + 1;
        setRetryCount(newRetry);
        setEncouragement(encouragements[Math.floor(Math.random() * encouragements.length)]);
        if (newRetry >= 2) {
          setFeedback("👂 Let’s listen together!");
          setShowHearIt(true);
        }
      }
    }
  };

  // Helper for Time Attack
  const loadNextWord = () => {
    if (timeAttackOver) return;
    const next = timeAttackWords[Math.floor(Math.random() * timeAttackWords.length)];
    setCurrentWord(next);
    setFeedback("Say: " + next);
    setStars(0);
    setAccuracyValue(null);
  };

  // This is for NORMAL mode
  const nextWord = () => {
    const next = currentIndex + 1;
    if (next < words.length) {
      setCurrentIndex(next);
      setCurrentWord(words[next]);
    } else {
      if (currentLevel < 3) {
        playSound("complete");
        setFeedback(`🏁 Level ${currentLevel} Complete! Loading next level...`);
        setShowConfetti(true);
        setTimeout(() => {
          const newLevel = currentLevel + 1;
          setCurrentLevel(newLevel);
          setWords(levels[newLevel]);
          setCurrentIndex(0);
          setCurrentWord(levels[newLevel][0]);
          setFeedback(`🎯 Welcome to Level ${newLevel}!`);
          setStars(0);
          setAccuracyValue(null);
        }, 2500);
      } else {
        playSound("complete");
        setShowConfetti(true);
        setGameComplete(true);
        setFeedback("🏆 You’ve mastered all levels! Amazing job!");
      }
    }
    setRetryCount(0);
    setStars(0);
    setAccuracyValue(null);
    setShowHearIt(false);
    setIsAfterHear(false);
  };

  const handleHearIt = () => {
    const utter = new SpeechSynthesisUtterance(currentWord);
    utter.rate = 0.55;
    utter.pitch = 0.9;
    utter.lang = "en-US";
    speechSynthesis.cancel();
    speechSynthesis.speak(utter);
    setFeedback("🔊 Listen carefully...");
    setIsAfterHear(true);
  };

  // Time Attack Game Over Screen
  if (timeAttackOver) {
    return (
      <div className="App-header">
        <h1>⏱️ Time's Up!</h1>
        <p style={{ fontSize: '1.5rem', margin: '10px' }}>Your Final Score:</p>
        <div style={{ fontSize: '4rem', fontWeight: 'bold', color: '#ff7b00' }}>
          {score}
        </div>
        <p>You got a {combo}-word combo!</p>
        <div style={{ display: "flex", gap: "20px", marginTop: "40px" }}>
          <button className="next-btn" onClick={onGoToMenu}>🏠 Back to Menu</button>
        </div>
      </div>
    );
  }

  // --- RENDER ---
  return (
    <div className="game-wrapper">
      {showConfetti && !isTimeAttack && <Confetti width={width} height={height} numberOfPieces={150} gravity={0.3} tweenDuration={6000} recycle={false} />}
      
      <header className="App-header">
        <div className="top-bar">
          <button onClick={onGoToMenu} className="back-btn">⬅ Back</button>
          
          {isTimeAttack ? (
            <div className="time-attack-hud">
              <div>Score: <span>{score}</span></div>
              <div>Time: <span>{timer}s</span></div>
            </div>
          ) : (
            <div className="level-header">
              <span>Level {currentLevel}</span>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${((currentIndex + 1) / words.length) * 100}%` }}></div>
              </div>
            </div>
          )}
        </div>

        <motion.div className="word-bubble" initial={{ scale: 0 }} animate={{ scale: 1 }}>
          {currentWord}
        </motion.div>

        {/* ARCADE COMBO BADGE */}
        <div style={{ height: '40px', marginBottom: '10px' }}>
          <AnimatePresence>
            {combo >= 2 && (
              <motion.div 
                key={combo}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1.2, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: 'bold', 
                  color: '#ff4757', 
                  textShadow: '0 2px 10px rgba(255, 71, 87, 0.4)',
                  background: '#fff0f1',
                  padding: '5px 20px',
                  borderRadius: '20px',
                  border: '2px solid #ff4757'
                }}
              >
                🔥 COMBO x{combo}!
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {!isTimeAttack && (
          <div className="star-container">
            {[1, 2, 3].map((s) => <span key={s} className={s <= stars ? "star active" : "star"}>⭐</span>)}
          </div>
        )}

        {isRecording && (
          <canvas ref={canvasRef} width={200} height={60} style={{ margin: '10px 0' }} />
        )}

        <button className="mic-btn" onClick={handleMicClick} disabled={isRecording}>
          {isRecording ? "🛑 Recording..." : isAfterHear ? "🎙️ Try Again" : "🎙️ Speak"}
        </button>

        {!isTimeAttack && showHearIt && (
          <motion.button 
            onClick={handleHearIt} 
            className="hear-btn" 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
          >
            👂 Hear It
          </motion.button>
        )}

        {feedback && <motion.div className="feedback-banner" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>{feedback}</motion.div>}
        {encouragement && <motion.p className="encouragement" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{encouragement}</motion.p>}
        
        {/* Corrected line */}
        {accuracyValue !== null && <motion.p className="accuracy subtle" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Accuracy: {accuracyValue}%</motion.p>}

        {!isTimeAttack && (
          <button className="next-btn" onClick={nextWord}>Next ⏭️</button>
        )}
      </header>
    </div>
  );
}

export default ChallengeScreen;
