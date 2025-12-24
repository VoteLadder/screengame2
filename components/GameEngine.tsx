
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { GameStatus, Target, HandPoint } from '../types';

declare const Hands: any;
declare const Camera: any;
declare const drawConnectors: any;
declare const drawLandmarks: any;
declare const HAND_CONNECTIONS: any;

interface GameEngineProps {
  status: GameStatus;
  onScoreChange: (points: number) => void;
  onCameraReady: () => void;
}

const COLORS = [
  '#ff0000', // Bug Red
  '#00ff00', // Lint Green
  '#00ffff', // Sync Cyan
  '#ffff00', // Warning Yellow
  '#ff00ff'  // Exception Magenta
];

const GameEngine: React.FC<GameEngineProps> = ({ status, onScoreChange, onCameraReady }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const targetsRef = useRef<Target[]>([]);
  const handRef = useRef<HandPoint | null>(null);
  const lastSpawnTime = useRef<number>(0);
  const [fps, setFps] = useState(0);

  // Initialize MediaPipe Hands
  useEffect(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const hands = new Hands({
      locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
    });

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    hands.onResults((results: any) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw Video (Mirrored)
      ctx.save();
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.globalAlpha = 0.3; // Faint video for background
      ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
      ctx.restore();

      // Detect Finger Tip (Index finger is landmark 8)
      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const landmarks = results.multiHandLandmarks[0];
        const indexTip = landmarks[8];
        
        // Convert normalized coordinates (0-1) to pixel coordinates (mirrored)
        const handX = (1 - indexTip.x) * canvas.width;
        const handY = indexTip.y * canvas.height;
        handRef.current = { x: handX, y: handY };

        // Draw Pointer
        ctx.beginPath();
        ctx.arc(handX, handY, 12, 0, Math.PI * 2);
        ctx.fillStyle = '#007acc';
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#007acc';
        ctx.fill();
        ctx.closePath();

        // Draw skeleton lightly
        ctx.save();
        ctx.globalAlpha = 0.5;
        // Manual simple draw of hand skeleton to avoid needing drawing_utils.js
        for (const landmarks of results.multiHandLandmarks) {
          ctx.beginPath();
          ctx.strokeStyle = '#007acc';
          ctx.lineWidth = 2;
          // Simple visualization: loop landmarks
          landmarks.forEach((lm: any) => {
            ctx.fillRect((1 - lm.x) * canvas.width - 2, lm.y * canvas.height - 2, 4, 4);
          });
        }
        ctx.restore();
      } else {
        handRef.current = null;
      }

      // Update and Draw Targets
      updateTargets(ctx);
    });

    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        if (videoRef.current) await hands.send({ image: videoRef.current });
      },
      width: 1280,
      height: 720
    });

    camera.start().then(() => {
      onCameraReady();
    });

    return () => {
      camera.stop();
      hands.close();
    };
  }, [onCameraReady]);

  const updateTargets = useCallback((ctx: CanvasRenderingContext2D) => {
    if (status !== GameStatus.PLAYING) {
      targetsRef.current = [];
      return;
    }

    const now = Date.now();
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Spawn logic
    if (now - lastSpawnTime.current > 600) { // Spawn every 0.6s
      const id = Math.random().toString(36).substring(7);
      const radius = 20 + Math.random() * 20;
      targetsRef.current.push({
        id,
        x: radius + Math.random() * (canvas.width - radius * 2),
        y: radius + Math.random() * (canvas.height - radius * 2),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        radius,
        points: Math.floor(radius),
        createdAt: now,
        duration: 2000 + Math.random() * 2000, // Stay for 2-4 seconds
        type: Math.random() > 0.8 ? 'bug' : 'ball'
      });
      lastSpawnTime.current = now;
    }

    // Filter and Render
    targetsRef.current = targetsRef.current.filter(target => {
      const age = now - target.createdAt;
      if (age > target.duration) return false;

      // Collision detection with hand
      if (handRef.current) {
        const dist = Math.sqrt(
          Math.pow(handRef.current.x - target.x, 2) + 
          Math.pow(handRef.current.y - target.y, 2)
        );
        if (dist < target.radius + 10) {
          onScoreChange(target.points);
          return false; // Remove hit target
        }
      }

      // Draw Target
      const opacity = 1 - (age / target.duration);
      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.shadowBlur = 20;
      ctx.shadowColor = target.color;
      
      ctx.beginPath();
      if (target.type === 'bug') {
        // Draw a simple bug/square
        ctx.rect(target.x - target.radius, target.y - target.radius, target.radius * 2, target.radius * 2);
      } else {
        // Draw a ball
        ctx.arc(target.x, target.y, target.radius, 0, Math.PI * 2);
      }
      ctx.fillStyle = target.color;
      ctx.fill();
      
      // Add "flicker"
      if (Math.random() > 0.8) {
        ctx.fillStyle = 'white';
        ctx.fill();
      }

      ctx.restore();
      return true;
    });
  }, [status, onScoreChange]);

  // Adjust canvas size on mount/resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current && canvasRef.current.parentElement) {
        canvasRef.current.width = canvasRef.current.parentElement.clientWidth;
        canvasRef.current.height = canvasRef.current.parentElement.clientHeight;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="w-full h-full bg-black relative">
      <video ref={videoRef} className="hidden" playsInline muted />
      <canvas 
        ref={canvasRef} 
        className="w-full h-full block" 
      />
      {status === GameStatus.PLAYING && (
        <div className="absolute top-4 right-4 text-xs font-mono text-green-500 pointer-events-none">
          ENGINE: RUNNING | HANDS: DETECTED
        </div>
      )}
    </div>
  );
};

export default GameEngine;
