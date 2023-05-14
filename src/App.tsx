import React, { useState } from 'react';
import './App.css';
import { Score } from './components/score/Score';
import { Game } from './components/game/Game';

function App() {
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(Number(localStorage.getItem('best')));

  const changeScore = (num: number) => {
    if (num === -1) {
      setScore(0);
      return;
    }
    const newScore = score + num;
    setScore(newScore);
    if (best < newScore) {
      setBest(newScore);
      localStorage.setItem('best', newScore.toString());
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1 className="title">2048</h1>
        <div className="score-container">
          <Score label="score" value={score} />
          <Score label="best" value={best} />
        </div>
      </div>
      <Game onScoreChange={changeScore} />
    </div>
  );
}

export default App;
