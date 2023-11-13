import CanvasJSReact from "@canvasjs/react-charts";

import { INITIAL } from "./ProjectileMotion";

var CanvasJSChart = CanvasJSReact.CanvasJSChart;
const Graphs = ({ points }) => {
  let vy = points.reduce(
    (acc, point) => {
      // Update max vy
      acc.maximum = Math.max(acc.maximum, point.vy);
      // Update min vy
      acc.minimum = Math.min(acc.minimum, point.vy);
      return acc;
    },
    { maximum: -Infinity, minimum: Infinity }
  );
  console.log(vy);

  const optionsForHeightVsTime = {
    animationEnabled: true,
    title: {
      text: "Height vs Time Graph",
    },
    axisX: {
      title: "Time",
      valueFormatString: "#0.##",
      suffix: "s",
      minimum: 0,
      maximum: points[points.length - 1]?.t + 1 || 10,
    },
    axisY: {
      title: "Height",
      valueFormatString: "#0.##",
      suffix: "m",
      minimum: 0,
      maximum: INITIAL.canvasDimension.y - points[points.length - 1]?.y || 10, //TODO: add maximum height to the projectile
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
      maximum: points[points.length - 1]?.t + 1 || 10,
    },
    axisY: {
      title: "Height",
      valueFormatString: "#0.##",
      suffix: "m/s",
      minimum: vy?.minimum - 10 || 0,
      maximum: vy?.maximum + 10 || 10,
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
  return (
    <div style={{ display: "flex", flexDirection: "row", margin: "2vh" }}>
      <div className="graphs" style={{ width: "50%" }}>
        <CanvasJSChart
          options={optionsForHeightVsTime}
          /* onRef = {ref => this.chart = ref} */
        />
      </div>
      <div className="graphs" style={{ width: "50%" }}>
        <CanvasJSChart
          options={optionsForVerticalVelocityVsTime}
          /* onRef = {ref => this.chart = ref} */
        />
      </div>
    </div>
  );
};

export default Graphs;
