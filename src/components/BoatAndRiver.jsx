import { useEffect, useRef, useState } from "react";
import image from "../assets/boat.png";

const sizes = {
  boat: {
    x: 100,
    y: 50,
  },
  river: {
    x: 600,
    y: 400,
  },
};

const BoatAndRiver = () => {
  const canvasRef = useRef(null);
  const [isAnimating, setIsAnimating] = useState(false);
  let canvas, ctx;
  useEffect(() => {
    canvas = canvasRef.current;
    ctx = canvas.getContext("2d");
    draw();
  }, []);
  const boat = {
    x: 200,
    y: 325,
  };
  const boatSpeed = {
    angle: 90,
    dx: 5,
    dy: 5,
  };

  const boatSpeedBuffer = { ...boatSpeed };
  const riverSpeed = 0; //static river

  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#13bdb8";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const boatImg = new Image();
    boatImg.src = image;
    ctx.drawImage(boatImg, boat.x, boat.y, sizes.boat.x, sizes.boat.y);

    // ctx.fill();
    console.log(ctx);
  };

  const animate = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the water
    ctx.fillStyle = "#13bdb8";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // const banks = new Path2D(
    //   `M0 0 h ${canvas.width} M0 ${10 + canvas.height} h ${canvas.width}`
    // );
    // ctx.stroke(banks);
    // Update the boat position
    const radians = (boatSpeed.angle * Math.PI) / 180;
    const dx = Math.cos(radians) * boatSpeed.dx;
    const dy = Math.sin(radians) * boatSpeed.dy;
    boat.x += dx;
    boat.y -= dy;

    // Draw the boat
    const boatImg = new Image();
    boatImg.src = image;
    ctx.drawImage(boatImg, boat.x, boat.y, sizes.boat.x, sizes.boat.y);
    // ctx.fillRect(boat.x, boat.y, 100, 10);

    // ctx.fillStyle = "#000";

    // ctx.arc(
    //   boat.x + sizes.boat.x / 2,
    //   boat.y + sizes.boat.y / 2,
    //   5,
    //   0,
    //   Math.PI * 2
    // );
    // ctx.fill();
    // Check if the boat has reached the other bank
    if (
      boat.x > canvas.width ||
      boat.y > canvas.height ||
      boat.x < 0 ||
      boat.y < 0
    ) {
      boatSpeed.dx = 0;
      boatSpeed.dy = 0;

      return;
    }

    requestAnimationFrame(animate);
  };

  const Stop = () => {
    boatSpeedBuffer.dx = boatSpeed.dx;
    boatSpeedBuffer.dy = boatSpeed.dy;
    boatSpeed.dx = 0;
    boatSpeed.dy = 0;
  };
  const Start = () => {
    boatSpeed.dx = boatSpeedBuffer.dx;
    boatSpeed.dy = boatSpeedBuffer.dy;
    animate();
  };
  const Reset = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw();
    boat.x = 200;
    boat.y = 325;
    boatSpeedBuffer.dx = boatSpeed.dx;
    boatSpeedBuffer.dy = boatSpeed.dy;
    boatSpeed.dx = 0;
    boatSpeed.dy = 0;
  };
  return (
    <div style={{ margin: "5vh", padding: "5vh" }}>
      <canvas ref={canvasRef} width={sizes.river.x} height={sizes.river.y} />
      <button onClick={Start}>{isAnimating ? "Resume" : "Start"}</button>
      <button onClick={Stop}>Stop</button>
      <button onClick={Reset}>Reset</button>
    </div>
  );
};

export default BoatAndRiver;
