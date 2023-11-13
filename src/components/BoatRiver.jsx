import { useEffect, useRef, useState } from "react";
import image from "../assets/boat.png";
import drawArrow from "../utils/drawArrow";

// constants

const velocities = {
  river: 35,
  boat: {
    magnitude: 80,
    angle: 120,
  },
};
// scale is used to scale the velocity of boat
const scale = 0.1;

const INITIAL = {
  boatSize: {
    x: 60,
    y: 60,
  },
  riverSize: {
    x: 600,
    y: 400,
  },
  boatPosition: {
    x: 270,
    y: 340,
  },
};

const theta = "θ";
const getCenterOfBoat = (boatPosition) => ({
  x: boatPosition.x + INITIAL.boatSize.x / 2,
  y: boatPosition.y + INITIAL.boatSize.y / 2,
});

const BoatRiver = ({ magnitude, angle }) => {
  const canvasRef = useRef(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [started, setStarted] = useState(false);
  const [ended, setEnded] = useState(false);
  const [bufferValues, setBufferValues] = useState({
    boatPosition: { ...INITIAL.boatPosition },
    boatSpeed: { ...INITIAL.boatSpeed },
  });

  let values = {
    boatPosition: { ...INITIAL.boatPosition },
    boatSpeed: { ...INITIAL.boatSpeed },
  };
  (INITIAL.boatSpeed = {
    angle: angle,
    dx: magnitude * scale * Math.cos((angle * Math.PI) / 180),
    dy: magnitude * scale * Math.sin((angle * Math.PI) / 180),
  }),
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
      values.boatPosition.x += values.boatSpeed.dx;
      values.boatPosition.y -= values.boatSpeed.dy;
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
    values.boatPosition = { ...INITIAL.boatPosition };
    values.boatSpeed = { ...INITIAL.boatSpeed };

    drawBankAndRiver(ctx, canvas);

    const boatImg = new Image();
    boatImg.onload = () => {
      ctx.drawImage(
        boatImg,
        values.boatPosition.x,
        values.boatPosition.y,
        INITIAL.boatSize.x,
        INITIAL.boatSize.y
      );
    };
    boatImg.src = image;

    renderAnnotations(ctx, canvas);
  };

  const renderAnnotations = (ctx) => {
    // arrow

    drawArrow(
      ctx,
      getCenterOfBoat(INITIAL.boatPosition),
      getEndPoint(),
      15,
      "black"
    );

    // draw arc of angle
    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.arc(
      getCenterOfBoat(INITIAL.boatPosition).x,
      getCenterOfBoat(INITIAL.boatPosition).y,
      50,
      0,
      2 * Math.PI - (values.boatSpeed.angle * Math.PI) / 180,
      true
    );
    ctx.stroke();

    // Draw the text (theta) just outside the arc
    const textX =
      getCenterOfBoat(INITIAL.boatPosition).x +
      (values.boatSpeed.angle > 90 ? 40 : 60); // Adjust the X-coordinate as needed
    const textY =
      getCenterOfBoat(INITIAL.boatPosition).y -
      (values.boatSpeed.angle > 90 ? 50 : 30); // Keep it close to the arc
    ctx.font = "24px Arial"; // Adjust the font size and family as needed
    ctx.fillStyle = "black"; // Set the text color
    ctx.fillText(theta, textX, textY);
  };
  const drawBankAndRiver = (ctx, canvas) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#13bdb8";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // banks
    ctx.fillStyle = "#c2b280";
    ctx.fillRect(0, 0, canvas.width, INITIAL.boatSize.y / 2);
    ctx.fillRect(
      0,
      INITIAL.riverSize.y - INITIAL.boatSize.y / 2,
      canvas.width,
      INITIAL.boatSize.y
    );
  };
  const render = (ctx, canvas) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#13bdb8";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawBankAndRiver(ctx, canvas);

    const boatImg = new Image();
    boatImg.src = image;
    ctx.drawImage(
      boatImg,
      values.boatPosition.x,
      values.boatPosition.y,
      INITIAL.boatSize.x,
      INITIAL.boatSize.y
    );
    renderAnnotations(ctx);
  };

  // utility functions
  const start = () => {
    setIsAnimating(true);
    setStarted(true);
  };

  const boundaryCheck = () =>
    values.boatPosition.x >= INITIAL.riverSize.width ||
    values.boatPosition.y >= INITIAL.riverSize.height ||
    values.boatPosition.x < 0 ||
    values.boatPosition.y < 0;

  const getEndPoint = () => {
    const angle = values.boatSpeed.angle;
    const radians = (angle * Math.PI) / 180;
    const dx =
      ((INITIAL.riverSize.y - INITIAL.boatSize.y) * Math.cos(radians)) /
      Math.sin(radians);

    const initialPosition = getCenterOfBoat(INITIAL.boatPosition);
    const position = {
      x: initialPosition.x + dx,
      y: INITIAL.boatSize.y / 2,
    };

    return position;
  };

  const motionControl = () => {
    if (!started) {
      start();
    } else {
      setBufferValues(values);
      setIsAnimating(!isAnimating);
    }
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        width={INITIAL.riverSize.x}
        height={INITIAL.riverSize.y}
      />
      <br />
      <br />
      <p>
        velocity of Boat:
        <br />
        magnitude: {velocities.boat.magnitude} <br />
        angle ({theta}): {values.boatSpeed.angle}
      </p>
      <button onClick={motionControl} disabled={ended}>
        {started ? (isAnimating ? "Pause" : "Resume") : "Start"}
      </button>
      <button onClick={reset}>Reset</button>
    </>
  );
};

export default BoatRiver;
