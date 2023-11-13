import BoatRiver from "./components/BoatRiver";
import ProjectileMotion from "./components/ProjectileMotion";
// import ProjectileMotion from "./components/Testing";

function App() {
  return (
    <>
      <div>
        <BoatRiver magnitude={80} angle={120} />
        <ProjectileMotion />
      </div>
    </>
  );
}

export default App;
