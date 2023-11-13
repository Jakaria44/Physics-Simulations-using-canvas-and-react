import CanvasJSReact from "@canvasjs/react-charts";

import { useEffect, useState } from "react";

var CanvasJSChart = CanvasJSReact.CanvasJSChart;
const Graphs = ({ points }) => {
  const [ranges, setRanges] = useState({
    x: { min: Infinity, max: -Infinity },
    y: { min: Infinity, max: -Infinity },
    t: { min: Infinity, max: -Infinity },
    vx: { min: Infinity, max: -Infinity },
    vy: { min: Infinity, max: -Infinity },
    v: { min: Infinity, max: -Infinity },
    angle: { min: Infinity, max: -Infinity },
  });

  useEffect(() => {
    const calculateRanges = () => {
      // Initialize ranges object
      const initialRanges = {
        x: { min: Infinity, max: -Infinity },
        y: { min: Infinity, max: -Infinity },
        t: { min: Infinity, max: -Infinity },
        vx: { min: Infinity, max: -Infinity },
        vy: { min: Infinity, max: -Infinity },
        v: { min: Infinity, max: -Infinity },
        angle: { min: Infinity, max: -Infinity },
      };

      // Iterate through points to calculate ranges
      points.forEach((point) => {
        initialRanges.x.min = Math.min(initialRanges.x.min, point.x);
        initialRanges.x.max = Math.max(initialRanges.x.max, point.x);

        initialRanges.y.min = Math.min(initialRanges.y.min, point.y);
        initialRanges.y.max = Math.max(initialRanges.y.max, point.y);

        initialRanges.t.min = Math.min(initialRanges.t.min, point.t);
        initialRanges.t.max = Math.max(initialRanges.t.max, point.t);

        initialRanges.vx.min = Math.min(initialRanges.vx.min, point.vx);
        initialRanges.vx.max = Math.max(initialRanges.vx.max, point.vx);

        initialRanges.vy.min = Math.min(initialRanges.vy.min, point.vy);
        initialRanges.vy.max = Math.max(initialRanges.vy.max, point.vy);

        // Calculate v, angle, and update their ranges
        const v = Math.sqrt(point.vx ** 2 + point.vy ** 2);
        const angle = (Math.atan2(point.vy, point.vx) * 180) / Math.PI;

        initialRanges.v.min = Math.min(initialRanges.v.min, v);
        initialRanges.v.max = Math.max(initialRanges.v.max, v);

        initialRanges.angle.min = Math.min(initialRanges.angle.min, angle);
        initialRanges.angle.max = Math.max(initialRanges.angle.max, angle);
      });

      // Set the calculated ranges in the state
      setRanges(initialRanges);
    };

    calculateRanges();
  }, [points]);

  const optionsForHeightVsTime = {
    animationEnabled: true,
    title: {
      text: "Height vs Time Graph",
    },
    axisX: {
      title: "Time",
      valueFormatString: "#0.##",
      suffix: "s",
      minimum: ranges.t.min - 10 || 0,
      maximum: ranges.t.max + 10 || 10,
    },
    axisY: {
      title: "Height",
      valueFormatString: "#0.##",
      suffix: "m",
      minimum: ranges.y.min - 10 || 0,
      maximum: ranges.y.max + 10 || 10,
    },
    width: 600,
    data: [
      {
        type: "spline",
        xValueFormatString: "#0.##",
        yValueFormatString: "#0.##",
        dataPoints: points.map((point) => ({
          x: point.t,
          y: point.y,
        })),
      },
    ],
  };
  const optionsForVerticalVelocityVsTime = {
    animationEnabled: true,
    title: {
      text: "Vertical Velocity vs Time Graph",
    },
    axisX: {
      title: "Time",
      valueFormatString: "#0.##",
      suffix: "s",
      minimum: 0,
      maximum: ranges.t.max + 10 || 10,
    },
    axisY: {
      title: "Vertical Velocity",
      valueFormatString: "#0.##",
      suffix: "m/s",
      minimum: ranges.vy.min - 10 || 0,
      maximum: ranges.vy.max + 10 || 10,
    },
    width: 600,
    data: [
      {
        type: "spline",
        xValueFormatString: "#0.##",
        yValueFormatString: "#0.##",
        dataPoints: points.map((point) => ({
          x: point.t,
          y: point.vy,
        })),
      },
    ],
  };

  const velocityVsTimeOptions = {
    animationEnabled: true,
    title: {
      text: "Total Velocity vs Time Graph",
    },
    axisX: {
      title: "Time",
      valueFormatString: "#0.##",
      suffix: "s",
      minimum: 0 - 5,
      maximum: ranges.t.max + 5 || 10,
    },
    axisY: {
      title: "Total Velocity",
      valueFormatString: "#0.##",
      suffix: "m/s",
      minimum: ranges.v.min - 5 || 0,
      maximum: ranges.v.max + 50 || 10,
    },
    width: 600,
    data: [
      {
        type: "spline",
        xValueFormatString: "#0.##",
        yValueFormatString: "#0.##",
        dataPoints: points.map((point) => ({
          x: point.t,
          y: Math.sqrt(point.vx ** 2 + point.vy ** 2),
        })),
      },
    ],
  };

  const velocityVsAngleOptions = {
    animationEnabled: true,
    title: {
      text: "Total Velocity vs Angle Graph",
    },
    axisX: {
      title: "Angle",
      valueFormatString: "#0.##",
      suffix: "°",
      minimum: -90,
      maximum: 90,
    },
    axisY: {
      title: "Total Velocity",
      valueFormatString: "#0.##",
      suffix: "m/s",
      minimum: ranges.v.min - 10 || 0,
      maximum: ranges.v.max + 10 || 10,
    },
    width: 600,
    data: [
      {
        type: "spline",
        xValueFormatString: "#0.##",
        yValueFormatString: "#0.##",
        dataPoints: points.map((point) => ({
          x: Math.atan(point.vy / point.vx) * (180 / Math.PI),
          y: Math.sqrt(point.vx ** 2 + point.vy ** 2),
        })),
      },
    ],
  };

  const xVsYOptions = {
    animationEnabled: true,
    title: {
      text: "Height vs Horizontal displacement Graph",
    },
    axisX: {
      title: "Horizontal displacement",
      valueFormatString: "#0.##",
      suffix: "m",
      minimum: ranges.x.min - 10 || 0,
      maximum: ranges.x.max + 10 || 10,
    },
    axisY: {
      title: "Height",
      valueFormatString: "#0.##",
      suffix: "m",
      minimum: ranges.y.min - 10 || 0,
      maximum: ranges.y.max + 10 || 10,
    },
    width: 600,
    data: [
      {
        type: "spline",
        xValueFormatString: "#0.##",
        yValueFormatString: "#0.##",
        dataPoints: points.map((point) => ({
          x: point.x,
          y: point.y,
        })),
      },
    ],
  };
  return (
    <>
      <div style={{ display: "flex", flexDirection: "row", margin: "2vh" }}>
        <div className="graphs" style={{ width: "50%" }}>
          <CanvasJSChart
            options={optionsForHeightVsTime}
            /* onRef = {ref => this.chart = ref} */
          />
        </div>
        <div className="graphs" style={{ width: "50%" }}>
          <CanvasJSChart
            options={xVsYOptions}
            /* onRef = {ref => this.chart = ref} */
          />
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "row", margin: "2vh" }}>
        <div className="graphs" style={{ width: "50%" }}>
          <CanvasJSChart
            options={velocityVsTimeOptions}
            /* onRef = {ref => this.chart = ref} */
          />
        </div>
        <div className="graphs" style={{ width: "50%" }}>
          <CanvasJSChart
            options={velocityVsAngleOptions}
            /* onRef = {ref => this.chart = ref} */
          />
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "row", margin: "2vh" }}>
        <div className="graphs" style={{ width: "50%" }}>
          <CanvasJSChart
            options={optionsForVerticalVelocityVsTime}
            /* onRef = {ref => this.chart = ref} */
          />
        </div>
      </div>
    </>
  );
};

export default Graphs;
