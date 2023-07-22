import React, { useEffect, useRef, useState } from "react";
import "../lib/flex.css";
import { div } from "../lib/utils/classy";
import Stress from "./stress";
import { Platformer } from "./platformer";

const App: React.FC<{}> = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Platformer>(null);
  const [paused, setPaused] = useState<boolean>(true);
  useEffect(() => {
    if (canvasRef.current && statsRef.current && !engineRef.current)
      engineRef.current = Platformer(canvasRef.current, statsRef.current);
  }, []);
  return (
    <Background>
      <Foreground>
        <button
          style={{ display: !paused ? "none" : "block" }}
          onClick={() => {
            setPaused(false);
            engineRef.current?.setPaused(false);
          }}
        >
          Start
        </button>
        <Window style={{ display: paused ? "none" : "block" }} ref={canvasRef}>
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
