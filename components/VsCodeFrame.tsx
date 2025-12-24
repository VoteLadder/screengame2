
import React from 'react';
import { GameStatus } from '../types';

interface VsCodeFrameProps {
  children: React.ReactNode;
  score: number;
  highScore: number;
  timeLeft: number;
  status: GameStatus;
  commentary: string;
  onStart: () => void;
  isCameraReady: boolean;
}

const VsCodeFrame: React.FC<VsCodeFrameProps> = ({ 
  children, score, highScore, timeLeft, status, commentary, onStart, isCameraReady 
}) => {
  return (
    <div className="flex flex-col h-full">
      {/* Title Bar */}
      <div className="h-8 bg-[#323233] flex items-center px-4 justify-between border-b border-[#2b2b2b]">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
        </div>
        <div className="text-xs text-[#8e8e8e]">game.tsx — VS Code Hand-Tracking</div>
        <div className="w-12"></div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Activity Bar */}
        <div className="w-12 bg-[#333333] flex flex-col items-center py-4 space-y-4">
          <div className="text-[#858585] hover:text-white cursor-pointer">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M13,2V11H21V2H13M15,4H19V9H15V4M3,2V11H11V2H3M5,4H9V9H5V4M13,13V22H21V13H13M15,15H19V20H15V15M3,13V22H11V13H3M5,15H9V20H5V15Z" /></svg>
          </div>
          <div className="text-[#858585] hover:text-white cursor-pointer">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" /></svg>
          </div>
        </div>

        {/* Side Bar */}
        <div className="w-64 bg-[#252526] flex flex-col border-r border-[#1a1a1a]">
          <div className="px-4 py-2 text-[11px] font-bold text-[#bbbbbb] tracking-wider uppercase">Explorer</div>
          <div className="flex flex-col">
            <div className="px-4 py-1 text-xs text-[#cccccc] bg-[#37373d] flex items-center space-x-2">
              <span className="text-blue-400">TS</span>
              <span>src/game.tsx</span>
            </div>
            <div className="px-4 py-1 text-xs text-[#8e8e8e] hover:bg-[#2a2d2e] cursor-pointer flex items-center space-x-2">
              <span className="text-yellow-400">JS</span>
              <span>index.js</span>
            </div>
            <div className="px-4 py-1 text-xs text-[#8e8e8e] hover:bg-[#2a2d2e] cursor-pointer flex items-center space-x-2">
              <span className="text-purple-400">MD</span>
              <span>README.md</span>
            </div>
          </div>
          
          <div className="mt-auto p-4 border-t border-[#333333]">
            <h3 className="text-xs font-bold text-[#8e8e8e] mb-2 uppercase">Scoreboard</h3>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Current Score:</span>
                <span className="text-green-400 font-mono">{score}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Best Record:</span>
                <span className="text-blue-400 font-mono">{highScore}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Time:</span>
                <span className={`${timeLeft < 10 ? 'text-red-500' : 'text-yellow-400'} font-mono`}>{timeLeft}s</span>
              </div>
            </div>
          </div>
        </div>

        {/* Editor Group */}
        <div className="flex-1 flex flex-col relative bg-[#1e1e1e]">
          {/* Tabs */}
          <div className="h-9 bg-[#252526] flex">
            <div className="px-4 h-full flex items-center text-xs bg-[#1e1e1e] border-t border-[#007acc] space-x-2">
              <span className="text-blue-400">TS</span>
              <span>game.tsx</span>
              <span className="ml-2 hover:bg-[#333333] rounded px-1">×</span>
            </div>
          </div>

          {/* Main Workspace */}
          <div className="flex-1 relative overflow-hidden">
            {status === GameStatus.IDLE && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#1e1e1e]/80">
                <h1 className="text-4xl font-bold mb-4 text-[#007acc]">Hand-Tracking Bug Smasher</h1>
                <p className="mb-8 text-[#8e8e8e] text-center max-w-md">
                  Enable your camera and use your index finger to hit the flashing balls and bugs!
                </p>
                <button 
                  onClick={onStart}
                  disabled={!isCameraReady}
                  className={`px-8 py-3 rounded text-white transition-all transform hover:scale-105 ${
                    isCameraReady ? 'bg-[#007acc] hover:bg-[#005a9e]' : 'bg-gray-600 cursor-not-allowed'
                  }`}
                >
                  {isCameraReady ? 'Start Session' : 'Initializing Camera...'}
                </button>
              </div>
            )}

            {status === GameStatus.GAMEOVER && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#1e1e1e]/90">
                <h2 className="text-3xl font-bold mb-2 text-red-500">Compilation Error!</h2>
                <div className="bg-[#2d2d2d] p-6 rounded-lg border border-[#3e3e42] mb-6 text-center shadow-xl">
                  <p className="text-xl mb-2 text-white">Final Score: <span className="font-mono text-green-400">{score}</span></p>
                  <p className="text-sm text-[#8e8e8e]">Your High Score: {highScore}</p>
                </div>
                <button 
                  onClick={onStart}
                  className="bg-[#007acc] hover:bg-[#005a9e] px-8 py-3 rounded text-white transition-all transform hover:scale-105"
                >
                  Recompile & Restart
                </button>
              </div>
            )}

            {children}
          </div>

          {/* Terminal / Panel */}
          <div className="h-32 bg-[#1e1e1e] border-t border-[#333333] flex flex-col">
            <div className="h-8 bg-[#1e1e1e] flex items-center px-4 space-x-6 border-b border-[#333333]">
              <span className="text-[11px] font-bold border-b border-[#007acc] text-[#cccccc] cursor-pointer h-full flex items-center">TERMINAL</span>
              <span className="text-[11px] font-bold text-[#8e8e8e] hover:text-[#cccccc] cursor-pointer">DEBUG CONSOLE</span>
              <span className="text-[11px] font-bold text-[#8e8e8e] hover:text-[#cccccc] cursor-pointer">OUTPUT</span>
            </div>
            <div className="flex-1 p-3 font-mono text-xs overflow-y-auto">
              <div className="flex space-x-2">
                <span className="text-green-500">PS C:\users\dev\game&gt;</span>
                <span className="text-[#cccccc] animate-pulse">|</span>
              </div>
              <div className="text-[#8e8e8e] mt-1">
                {commentary.split('\n').map((line, i) => (
                  <div key={i}>[{new Date().toLocaleTimeString()}] {line}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="h-6 bg-[#007acc] flex items-center px-4 justify-between text-white text-[11px]">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12,18L4.5,20.29L5.21,15L1,11.54L6.47,10.77L9,5.81L11.53,10.77L17,11.54L12.79,15L13.5,20.29L12,18M18,2L14.81,4.81L16,6L19,3L22,6L23.19,4.81L20,2" /></svg>
            <span>master*</span>
          </div>
          <div className="flex items-center space-x-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.47 2,12C2,17.53 6.47,22 12,22C17.53,22 22,17.53 22,12C22,6.47 17.53,2 12,2M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20Z" /></svg>
            <span>0 errors</span>
          </div>
          <div className="flex items-center space-x-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M13,14H11V9H13V14M13,18H11V16H13V18M1,21H23L12,2L1,21Z" /></svg>
            <span>0 warnings</span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <span>Spaces: 2</span>
          <span>UTF-8</span>
          <span>TypeScript JSX</span>
          <span>Prettier</span>
        </div>
      </div>
    </div>
  );
};

export default VsCodeFrame;
