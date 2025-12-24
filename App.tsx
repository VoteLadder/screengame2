
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameStatus, Target, HandPoint, GameState } from './types';
import { getGeminiCommentary } from './services/geminiService';
import VsCodeFrame from './components/VsCodeFrame';
import GameEngine from './components/GameEngine';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    highScore: 0,
    status: GameStatus.IDLE,
    targets: [],
    timeLeft: 60,
  });
  const [commentary, setCommentary] = useState("Initializing IDE environment...");
  const [isCameraReady, setIsCameraReady] = useState(false);

  const startGame = () => {
    setGameState(prev => ({
      ...prev,
      score: 0,
      status: GameStatus.PLAYING,
      timeLeft: 30,
      targets: []
    }));
    setCommentary("Process started: game.exe running...");
  };

  const endGame = useCallback(async (finalScore: number) => {
    setGameState(prev => {
      const newHighScore = Math.max(prev.highScore, finalScore);
      return {
        ...prev,
        status: GameStatus.GAMEOVER,
        highScore: newHighScore
      };
    });
    setCommentary("Generating performance report...");
    const report = await getGeminiCommentary(finalScore, gameState.highScore);
    setCommentary(report);
  }, [gameState.highScore]);

  useEffect(() => {
    if (gameState.status === GameStatus.PLAYING) {
      const timer = setInterval(() => {
        setGameState(prev => {
          if (prev.timeLeft <= 1) {
            clearInterval(timer);
            endGame(prev.score);
            return { ...prev, timeLeft: 0 };
          }
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameState.status, endGame]);

  return (
    <div className="h-screen w-screen flex flex-col bg-[#1e1e1e] select-none">
      <VsCodeFrame 
        score={gameState.score}
        highScore={gameState.highScore}
        timeLeft={gameState.timeLeft}
        status={gameState.status}
        commentary={commentary}
        onStart={startGame}
        isCameraReady={isCameraReady}
      >
        <GameEngine 
          status={gameState.status}
          onScoreChange={(points) => setGameState(prev => ({ ...prev, score: prev.score + points }))}
          onCameraReady={() => setIsCameraReady(true)}
        />
      </VsCodeFrame>
    </div>
  );
};

export default App;
