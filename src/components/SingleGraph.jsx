import React, { useRef, useEffect, useState } from "react";

const SmoothCurveGraphWithTooltipAndHighlight = ({
  data,
  title,
  xAxisLabel,
  yAxisLabel,
}) => {
  const canvasRef = useRef(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [hoveredPoint, setHoveredPoint] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    const gridSizeX = canvas.width / 10;
    const gridSizeY = canvas.height / 10;

    // Vertical grid lines
    for (let i = 1; i < 10; i++) {
      ctx.beginPath();
      ctx.moveTo(i * gridSizeX, 0);
      ctx.lineTo(i * gridSizeX, canvas.height);
      ctx.stroke();
    }

    // Horizontal grid lines
    for (let i = 1; i < 10; i++) {
      ctx.beginPath();
      ctx.moveTo(0, i * gridSizeY);
      ctx.lineTo(canvas.width, i * gridSizeY);
      ctx.stroke();
    }

    // Draw the smooth curve
    if (data.length >= 2) {
      ctx.beginPath();
      ctx.moveTo(data[0].x, data[0].y);

      for (let i = 1; i < data.length - 1; i++) {
        const xc = (data[i].x + data[i + 1].x) / 2;
        const yc = (data[i].y + data[i + 1].y) / 2;
        ctx.quadraticCurveTo(data[i].x, data[i].y, xc, yc);
      }

      // Connect the last two points with a straight line
      ctx.lineTo(data[data.length - 1].x, data[data.length - 1].y);
      ctx.stroke();
    }

    // Draw points
    ctx.fillStyle = "blue";
    for (let i = 0; i < data.length; i++) {
      ctx.beginPath();
      ctx.arc(data[i].x, data[i].y, 5, 0, 2 * Math.PI);
      ctx.fill();
    }

    // Highlight the hovered point
    if (hoveredPoint) {
      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.arc(hoveredPoint.x, hoveredPoint.y, 8, 0, 2 * Math.PI);
      ctx.fill();
    }

    // Draw labels
    ctx.fillStyle = "black";
    ctx.font = "12px Arial";
    ctx.textAlign = "center";

    // X-axis label
    ctx.fillText(xAxisLabel, canvas.width / 2, canvas.height - 5);

    // Y-axis label
    ctx.save();
    ctx.translate(10, canvas.height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(yAxisLabel, 0, 0);
    ctx.restore();

    // Title
    ctx.fillText(title, canvas.width / 2, 20);
  }, [data, hoveredPoint, title, xAxisLabel, yAxisLabel]);

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if the mouse is over any point
    for (let i = 0; i < data.length; i++) {
      const distance = Math.sqrt((x - data[i].x) ** 2 + (y - data[i].y) ** 2);
      if (distance <= 5) {
        setHoveredPoint(data[i]);
        setTooltipPosition({ x: e.clientX, y: e.clientY });
        break;
      } else {
        setHoveredPoint(null);
      }
    }
  };

  const handleMouseLeave = () => {
    setHoveredPoint(null);
  };

  return (
    <div style={{ position: "relative" }}>
      <canvas
        ref={canvasRef}
        width={600}
        height={300}
        style={{ border: "1px solid black" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      />
      {hoveredPoint && (
        <div
          style={{
            position: "absolute",
            left: tooltipPosition.x + 10,
            top: tooltipPosition.y - 20,
            background: "rgba(255, 255, 255, 0.8)",
            padding: "5px",
            borderRadius: "5px",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
          }}
        >
          Hovered Point: ({hoveredPoint.x}, {hoveredPoint.y})
        </div>
      )}
    </div>
  );
};

export default SmoothCurveGraphWithTooltipAndHighlight;
