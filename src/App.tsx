import React, { useEffect, useRef } from "react";
import "../lib/flex.css";
import { div } from "../lib/utils/classy";
import Stress from "./stress";
import Platformer from "./platformer";

const App: React.FC<{}> = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef(null);
  useEffect(() => {
    if (canvasRef.current && statsRef.current && !engineRef.current)
      engineRef.current = Platformer(canvasRef.current, statsRef.current);
  }, []);
  return (
    <Background>
      <Foreground>
        <Window ref={canvasRef}>
          <Stats ref={statsRef} style={{}} />
        </Window>
      </Foreground>
    </Background>
  );
};

const Background = div("flex center", {
  background: "navy",
});

const Foreground = div("flex stretch vertical", {
  minHeight: "90%",
  maxWidth: "90%",
  background: "red",
});

const Window = div("flex stretch", {
  background: "blue",
  height: "100%",
  width: "100%",
  overflow: "hidden",
});

const Stats = div("absolute", {
  overflow: "hidden",
  border: "2px white solid",
  color: "white",
});

export default App;
