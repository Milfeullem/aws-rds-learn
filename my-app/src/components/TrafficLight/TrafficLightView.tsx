const VEHICLE_CYCLE_ORDER = ["green", "yellow", "red"];

export default function TrafficLightView({ active, duration }) {
  return (
    <main className="app">
      <section className="shell" aria-label="Traffic light" aria-hidden="true">
        {VEHICLE_CYCLE_ORDER.map((vehicle) => {
          return (
            <div
              key={vehicle}
              className={`${vehicle} ${vehicle === active ? "active" : ""}`}
            />
          );
        })}
      </section>

      <p className="meta">
        Active: {active.toUpperCase()} ({duration}ms)
      </p>
    </main>
  );
}
