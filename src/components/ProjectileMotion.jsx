import { useEffect, useRef, useState } from "react";
import drawArrow, { drawArrowByAngle } from "../utils/drawArrow";

import Graphs from "./Graphs";
//var CanvasJSReact = require('@canvasjs/react-charts');

// constants

const properties = {
  velocity: {
    magnitude: 180,
    angle: 45,
  },
  height: 150, //initial height of the object. y0
  g: 9.8, //gravity
};

// scale is used to scale the velocity of boat
const scale = 0.1;

const objectSize = 10; //radius
export const INITIAL = {
  canvasDimension: {
    x: 700,
    y: 400,
  },
  objectPosition: {
    x: objectSize,
    y: 400 - objectSize - properties.height,
  },
  objectSpeed: {
    angle: (properties.velocity.angle * Math.PI) / 180, //in radians
    dx:
      properties.velocity.magnitude *
      scale *
      Math.cos((properties.velocity.angle * Math.PI) / 180),
    dy:
      properties.velocity.magnitude *
      scale *
      Math.sin((properties.velocity.angle * Math.PI) / 180),
  },
};

const theta = "θ";

// const getCenterOfBoat = (objectPosition) => ({
//   x: objectPosition.x + INITIAL.boatSize.x / 2,
//   y: objectPosition.y + INITIAL.boatSize.y / 2,
// });

const ProjectileMotion = () => {
  const canvasRef = useRef(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [started, setStarted] = useState(false);
  const [ended, setEnded] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(2);
  const [bufferIndex, setBufferIndex] = useState(0);
  const [points, setPoints] = useState([]);
  let values = {
    objectPosition: { ...INITIAL.objectPosition },
    objectSpeed: {
      magnitude: properties.velocity.magnitude,
      angle: (properties.velocity.angle * Math.PI) / 180,
    },
  };

  useEffect(() => {
    reset();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  let currentIndex = bufferIndex;
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    // for storing the values when paused

    const animate = () => {
      if (currentIndex < points.length && points[currentIndex].y > objectSize) {
        // console.log(points[currentIndex].y, canvas.height - objectSize);
        const { x, y, vy } = points[currentIndex];
        render(ctx, canvas, x, canvas.height - y, vy);
        currentIndex += animationSpeed;
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
        setEnded(true);
      }
    };
    drawProjectilePath(ctx, canvas, points);

    if (isAnimating) {
      currentIndex = bufferIndex;
      animate();
    }

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [isAnimating]); // eslint-disable-line react-hooks/exhaustive-deps

  // rendering functions

  // const drawPath = (ctx, canvas) => {
  //   let points = [];
  //   let { x, y } = INITIAL.objectPosition;
  //   points.push({ x, y });
  //   let tempPoint = { x, y };
  //   console.log(values.objectSpeed);

  //   while (tempPoint.y <= canvas.height - objectSize) {
  //     tempPoint.x += values.objectSpeed.dx / scale;
  //     tempPoint.y -= values.objectSpeed.dy / scale;
  //     values.objectSpeed.dy -= properties.g;
  //     points.push({ ...tempPoint });
  //     // console.log(tempPoint.y, canvas.height - objectSize);
  //   }

  //   console.log(points);

  //   // draw curve using points array
  //   // Draw the curve
  //   ctx.beginPath();
  //   ctx.moveTo(points[0].x, points[0].y);

  //   for (let i = 1; i < points.length - 2; i++) {
  //     const xc = (points[i].x + points[i + 1].x) / 2;
  //     const yc = (points[i].y + points[i + 1].y) / 2;
  //     ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
  //   }

  //   // curve through the last two points
  //   ctx.quadraticCurveTo(
  //     points[points.length - 2].x,
  //     points[points.length - 2].y,
  //     points[points.length - 1].x,
  //     points[points.length - 1].y
  //   );

  //   // Set the line color and width
  //   ctx.strokeStyle = "blue";
  //   ctx.lineWidth = 2;

  //   // Stroke the curve
  //   ctx.stroke();
  // };

  // Function to simulate the projectile motion
  /**
   *
   * @param {number} initialVelocity initial velocity in meters
   * @param {number} launchAngle initial angle in radians
   * @param {number} initialHeight initial height in meters
   * @param {number} timeStep for simulation
   * @param {number} scale for better viewing
   * @returns {Array} array of points
   */
  function simulateProjectileEquation(
    initialVelocity,
    launchAngle,
    initialHeight,
    timeStep
  ) {
    const g = 9.8; // Acceleration due to gravity (m/s^2)
    const radians = launchAngle;
    const cosTheta = Math.cos(radians);
    const tanTheta = Math.tan(radians);
    const v0squared = Math.pow(initialVelocity, 2);

    let x = 0;
    let y = 0;
    const points = [];

    for (let t = 0; y >= 0; t += timeStep) {
      x = initialVelocity * cosTheta * t;
      y =
        x * tanTheta -
        (g * Math.pow(x, 2)) / (2 * v0squared * Math.pow(cosTheta, 2)) +
        initialHeight;

      points.push({
        x: x * scale + objectSize,
        y: y * scale + objectSize,
        vy:
          initialVelocity * Math.sin(values.objectSpeed.angle) -
          properties.g * t,
        t: t,
      });
    }

    return points;
  }

  // Function to draw the projectile path on the canvas
  function drawProjectilePath(ctx, canvas, points) {
    if (points.length == 0) return;
    // console.log(points);
    ctx.beginPath();
    ctx.moveTo(points[0].x, canvas.height - points[0].y);

    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, canvas.height - points[i].y);
    }

    ctx.stroke();
  }

  const reset = () => {
    setEnded(false);
    setIsAnimating(false);
    setStarted(false);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    drawOuterStructure(ctx, canvas);
    drawBallObject(ctx, INITIAL.objectPosition.x, INITIAL.objectPosition.y);
    // drawPath(ctx, canvas);
    // values.objectSpeed = { ...INITIAL.objectSpeed };

    const pointsCalculated = calculatePoints();
    drawProjectilePath(ctx, canvas, pointsCalculated);
    renderAnnotations(
      ctx,
      INITIAL.objectPosition.x,
      INITIAL.objectPosition.y,
      pointsCalculated[0].vy
    );
  };

  const calculatePoints = () => {
    // Example usage
    const initialVelocity = values.objectSpeed.magnitude;
    const launchAngle = values.objectSpeed.angle; // in radians
    const initialHeight = properties.height / scale; // in meters
    const timeStep = 0.05; // in seconds
    const points = simulateProjectileEquation(
      initialVelocity,
      launchAngle,
      initialHeight,
      timeStep
    );
    console.log(points);
    setPoints(points);
    return points;
  };
  const renderAnnotations = (ctx, x, y, vy) => {
    const currentPosition = { x, y };
    const magnitude = values.objectSpeed.magnitude;
    const vx = magnitude * Math.cos(values.objectSpeed.angle);

    // vx arrow:
    // drawArrowByAngle(ctx, currentPosition, 0, vx, 15, "green");
    drawArrow(
      ctx,
      currentPosition,
      new Object({ x: currentPosition.x + vx, y: currentPosition.y }),
      10,
      "green"
    );

    // vy arrow:
    // drawArrowByAngle(ctx, currentPosition, -Math.PI / 2, vy, 15, "blue");
    drawArrow(
      ctx,
      currentPosition,
      new Object({ x: currentPosition.x, y: currentPosition.y - vy }),
      10,
      "blue"
    );

    // resultant velocity arrow
    const resultantVelocity = Math.sqrt(Math.pow(vx, 2) + Math.pow(vy, 2));
    const resultantAngle = Math.atan(vy / vx);
    // console.log(resultantAngle);
    drawArrowByAngle(
      ctx,
      currentPosition,
      resultantAngle,
      resultantVelocity,
      15,
      "black"
    );

    // draw dotted line from center of the ball to the end of the canvas
    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.setLineDash([5, 5]);
    ctx.moveTo(values.objectPosition.x, values.objectPosition.y);
    ctx.lineTo(INITIAL.canvasDimension.x, values.objectPosition.y);
    ctx.stroke();
    // draw dotted line to show the ground level for the ball object to fall
    ctx.moveTo(0, INITIAL.canvasDimension.y - objectSize);
    ctx.lineTo(
      INITIAL.canvasDimension.x,
      INITIAL.canvasDimension.y - objectSize
    );
    ctx.stroke();
    ctx.setLineDash([]);

    // draw arc of angle
    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.arc(
      currentPosition.x,
      currentPosition.y,
      50,
      resultantAngle > 0 ? 0 : -resultantAngle,
      resultantAngle > 0 ? -resultantAngle : 0,
      true
    );
    ctx.stroke();

    // Draw the text (theta) just outside the arc

    const textX = currentPosition.x + 50; // Adjust the X-coordinate as needed
    const textY = currentPosition.y - (resultantAngle > 0 ? 20 : 10); // Keep it close to the arc
    ctx.font = "14px Arial"; // Adjust the font size and family as needed
    ctx.fillStyle = "black"; // Set the text color
    ctx.fillText(
      `${theta} : ${((resultantAngle * 180) / Math.PI).toFixed(1)}°`,
      textX,
      textY
    );

    // Draw angle annotation
    ctx.fillStyle = "black";
    ctx.font = "14px Arial";
    ctx.fillText(`Angle: ${properties.velocity.angle}°`, 20, 20);

    // Draw velocity annotation
    ctx.fillText(`Initial Velocity: ${properties.velocity.magnitude}`, 20, 40);
  };

  const render = (ctx, canvas, x, y, vy) => {
    drawOuterStructure(ctx, canvas);
    drawBallObject(ctx, x, y);
    renderAnnotations(ctx, x, y, vy);
    drawProjectilePath(ctx, canvas, points);
  };

  const drawBallObject = (ctx, x, y) => {
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(x, y, objectSize, 0, 2 * Math.PI);
    ctx.fill();
  };
  const drawOuterStructure = (ctx, canvas) => {
    // complete canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
    // ctx.stroke();

    // if initial height available
    ctx.fillStyle = "#c2b280";
    ctx.fillRect(
      0,
      INITIAL.canvasDimension.y - properties.height,
      2 * objectSize,
      properties.height
    );

    // Draw angle annotation
    ctx.fillStyle = "black";
    ctx.font = "14px Arial";
    ctx.fillText(
      `h=${properties.height}`,
      2.5 * objectSize,
      INITIAL.canvasDimension.y - properties.height / 2
    );
  };

  // utility functions
  const start = () => {
    setIsAnimating(true);
    setStarted(true);
  };

  const motionControl = () => {
    if (!started) {
      start();
    } else {
      setBufferIndex(currentIndex);
      setIsAnimating(!isAnimating);
    }
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={INITIAL.canvasDimension.x}
        height={INITIAL.canvasDimension.y}
      />
      <br />
      <br />

      <button onClick={motionControl} disabled={ended}>
        {started ? (isAnimating ? "Pause" : "Resume") : "Start"}
      </button>
      <button onClick={reset}>Reset</button>
      <br />
      <Graphs points={points} />
    </div>
  );
};

export default ProjectileMotion;
