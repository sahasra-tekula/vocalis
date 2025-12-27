# Vocalis 🗣️

**Vocalis** is an AI-powered speech therapy and language learning platform designed specifically for children. Developed during a hackathon, this project provides an interactive, gamified environment to help young users improve their pronunciation and vocabulary through real-time feedback and engaging mechanics.

## 🚀 Key Features

* **Voice-Controlled Gameplay**: Integrated with the **Deepgram API** for real-time speech-to-text processing and pronunciation accuracy scoring.
* **Spaceship Revision Game**: A specialized game engine where users destroy word-obstacles by correctly pronouncing them, featuring dynamic physics, laser mechanics, and an immersive parallax star background.
* **Visual Learning (Picture Rounds)**: A dedicated mode that uses high-quality images instead of text to prompt speech, aiding pre-literate or visual learners.
* **Gamified Achievements**: A full-stack achievement system that rewards users with titles like "Word Wizard" and "Visual Learner" based on mastery and practice streaks.
* **Progress Tracking & Leaderboards**: Full-stack integration with **MongoDB** to track user performance, including accuracy percentages, mastered words, and competitive scores.

## 🛠️ Tech Stack

* **Frontend**: React.js, Framer Motion (animations), CSS3 (Custom game engines).
* **Backend**: Node.js, Express.
* **Database**: MongoDB (Mongoose).
* **APIs**: Deepgram (Speech-to-Text).

## 👥 My Contributions (sahasra-tekula)

As a core developer during the hackathon, I was responsible for the following:

* **Game Engine Development**: Built the core logic for the **Spaceship Revision Game**, including collision detection, laser firing mechanics, and responsive keyboard/voice controls.
* **Full-Stack Achievement System**: Designed the MongoDB schemas and backend logic to automatically calculate and award achievements based on user performance data.
* **UI/UX Redesign**: Revitalized the **Main Menu** with a child-friendly aesthetic and implemented the "child-friendly sky" UI theme across the application.
* **Feature Refinement**: Fixed critical logic bugs in the "Hear It" mode and updated the **Challenge Screen** to improve user engagement and retry-count accuracy.
* **API & Auth Integration**: Implemented backend endpoints for audio processing and fixed critical authentication typos to ensure stable user signups.

## ⚙️ Setup & Installation

1. **Clone the Repository**:
```bash
git clone https://github.com/sahasra-tekula/vocalis.git

```


2. **Environment Variables**:
Create a `.env` file in the `server` directory and add the following:
* `DEEPGRAM_KEY`: Your Deepgram API token.
* `MONGODB_URI`: Your MongoDB connection string.
* `JWT_SECRET`: A secret key for authentication.


3. **Install Dependencies**:
```bash
npm install

```


4. **Run the Project**:
* **Frontend**: `npm start` (Runs on Port 3000).
* **Backend**: Ensure the server is running on Port 3001.

