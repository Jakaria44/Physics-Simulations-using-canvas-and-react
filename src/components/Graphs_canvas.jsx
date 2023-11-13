import { INITIAL } from "./ProjectileMotion";
import SingleGraph from "./SingleGraph";

const SmoothCurveGraph = ({ data }) => {
  return (
    <div>
      {/* for height vs time graph */}
      <SingleGraph
        data={data.map((item) => ({
          x: item.t,
          y: INITIAL.canvasDimension.y - item.y,
        }))}
      />
    </div>
  );
};

export default SmoothCurveGraph;
