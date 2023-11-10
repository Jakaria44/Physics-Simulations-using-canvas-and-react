import { useEffect, useRef, useState } from "react";
import { drawArrowByAngle } from "../utils/drawArrow";

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
const INITIAL = {
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
  const [bufferValues, setBufferValues] = useState({
    objectPosition: { ...INITIAL.objectPosition },
    objectSpeed: { ...INITIAL.objectSpeed },
  });

  let values = {
    objectPosition: { ...INITIAL.objectPosition },
    objectSpeed: { ...INITIAL.objectSpeed },
  };

  useEffect(() => {
    reset();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    // for storing the values when paused
    values = bufferValues; // eslint-disable-line react-hooks/exhaustive-deps
    const animate = () => {
      // update
      values.objectSpeed.dy -= properties.g * scale;
      values.objectSpeed.angle = Math.atan(
        values.objectSpeed.dy / values.objectSpeed.dx // in radians
      );
      values.objectPosition.x += values.objectSpeed.dx;
      values.objectPosition.y -= values.objectSpeed.dy;
      render(ctx, canvas);
      if (boundaryCheck()) {
        setIsAnimating(false);
        setEnded(true);
        return;
      }
      animationFrameId = requestAnimationFrame(animate);
    };
    if (isAnimating) animate();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [isAnimating]); // eslint-disable-line react-hooks/exhaustive-deps

  // rendering functions

  const reset = () => {
    setEnded(false);
    setIsAnimating(false);
    setStarted(false);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    values.objectPosition = { ...INITIAL.objectPosition };
    values.objectSpeed = { ...INITIAL.objectSpeed };

    drawOuterStructure(ctx, canvas);
    drawBallObject(ctx);
    renderAnnotations(ctx, canvas);
  };

  const renderAnnotations = (ctx) => {
    // vx arrow:
    drawArrowByAngle(
      ctx,
      values.objectPosition,
      0,
      values.objectSpeed.dx / scale,
      15,
      "green"
    );

    // vy arrow:
    drawArrowByAngle(
      ctx,
      values.objectPosition,
      Math.PI / 2,
      values.objectSpeed.dy / scale,
      15,
      "blue"
    );

    // resultant velocity arrow
    const resultantVelocity = Math.sqrt(
      Math.pow(values.objectSpeed.dx / scale, 2) +
        Math.pow(values.objectSpeed.dy / scale, 2)
    );
    const resultantAngle = values.objectSpeed.angle;
    console.log(resultantAngle);
    drawArrowByAngle(
      ctx,
      values.objectPosition,
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
    ctx.setLineDash([]);
    // draw arc of angle
    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.arc(
      values.objectPosition.x,
      values.objectPosition.y,
      50,
      resultantAngle > 0 ? 0 : -resultantAngle,
      resultantAngle > 0 ? -resultantAngle : 0,
      true
    );
    ctx.stroke();

    // Draw the text (theta) just outside the arc

    const textX =
      values.objectPosition.x +
      (values.objectSpeed.angle > Math.PI / 2 ? 40 : 60); // Adjust the X-coordinate as needed
    const textY =
      values.objectPosition.y -
      (values.objectSpeed.angle > Math.PI / 2 ? 50 : 30); // Keep it close to the arc
    ctx.font = "24px Arial"; // Adjust the font size and family as needed
    ctx.fillStyle = "black"; // Set the text color
    ctx.fillText(theta, textX, textY);

    // Draw angle annotation
    ctx.fillStyle = "black";
    ctx.font = "14px Arial";
    ctx.fillText(`Angle: ${properties.velocity.angle}°`, 20, 20);

    // Draw velocity annotation
    ctx.fillText(`Initial Velocity: ${properties.velocity.magnitude}`, 20, 40);
  };

  const render = (ctx, canvas) => {
    drawOuterStructure(ctx, canvas);
    drawBallObject(ctx);
    renderAnnotations(ctx);
  };

  const drawBallObject = (ctx) => {
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(
      values.objectPosition.x,
      values.objectPosition.y,
      objectSize,
      0,
      2 * Math.PI
    );
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
  };

  // utility functions
  const start = () => {
    setIsAnimating(true);
    setStarted(true);
  };

  const boundaryCheck = () =>
    // values.objectPosition.x >= INITIAL.riverSize.width ||
    values.objectPosition.y >= INITIAL.canvasDimension.y - objectSize;

  const motionControl = () => {
    if (!started) {
      start();
    } else {
      setBufferValues(values);
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
    </div>
  );
};

export default ProjectileMotion;
