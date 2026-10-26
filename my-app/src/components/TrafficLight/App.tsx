import { useEffect, useState } from "react";
import TrafficLightView from "./TrafficLightView";

const VEHICLE_CYCLE_ORDER = ["green", "yellow", "red"];

const VEHICLE_DURATIONS_MS = {
  green: 3000,
  yellow: 500,
  red: 4000,
};

function nextVehicleSignal(current) {
  const i = VEHICLE_CYCLE_ORDER.indexOf(current);

  return VEHICLE_CYCLE_ORDER[(i + 1) % VEHICLE_CYCLE_ORDER.length];
}

// Tip: You can create new files by clicking on Expand file explorer icon in the top bar.
export default function App() {
  const [active, setActive] = useState("green");

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setActive((curr) => nextVehicleSignal(curr));
    }, VEHICLE_DURATIONS_MS[active]);

    return () => window.clearTimeout(timeoutId);
  }, [active]);

  return (
    <TrafficLightView active={active} duration={VEHICLE_DURATIONS_MS[active]} />
  );
}
