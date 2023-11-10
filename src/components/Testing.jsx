import React, { useRef, useState } from "react";

const ProjectileMotion = () => {
  const canvasRef = useRef(null);
  const [isRunning, setIsRunning] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 550 });
  const [velocity, setVelocity] = useState({ magnitude: 10, angle: 45 });
  const animationIdRef = useRef(null);

  const updateCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const { x, y } = position;
    const { magnitude, angle } = velocity;

    // Calculate new position based on velocity and angle
    const radians = (angle * Math.PI) / 180;
    const vx = magnitude * Math.cos(radians);
    const vy = magnitude * Math.sin(radians);

    setPosition({ x: x + vx, y: y - vy });

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the projectile (circle)
    ctx.beginPath();
    ctx.arc(position.x, position.y, 10, 0, 2 * Math.PI);
    ctx.fillStyle = "red";
    ctx.fill();

    // Draw angle and velocity vectors
    ctx.beginPath();
    ctx.moveTo(position.x, position.y);
    ctx.lineTo(position.x + vx, position.y - vy);
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw angle annotation
    ctx.fillStyle = "black";
    ctx.font = "14px Arial";
    ctx.fillText(`Angle: ${angle}°`, 20, 20);

    // Draw velocity annotation
    ctx.fillText(`Velocity: ${magnitude}`, 20, 40);

    // Request the next animation frame
    animationIdRef.current = requestAnimationFrame(updateCanvas);
  };

  const handleStart = () => {
    setIsRunning(true);
    updateCanvas();
  };

  const handlePause = () => {
    setIsRunning(false);
    cancelAnimationFrame(animationIdRef.current);
  };

  const handleResume = () => {
    setIsRunning(true);
    updateCanvas();
  };

  const handleReset = () => {
    setIsRunning(false);
    setPosition({ x: 50, y: 550 });
    setVelocity({ magnitude: 0, angle: 45 });
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        style={{ border: "1px solid black" }}
      ></canvas>
      <div>
        <button onClick={handleStart}>Start</button>
        <button onClick={handlePause}>Pause</button>
        <button onClick={handleResume}>Resume</button>
        <button onClick={handleReset}>Reset</button>
      </div>
    </div>
  );
};

export default ProjectileMotion;
