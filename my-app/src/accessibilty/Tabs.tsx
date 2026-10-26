import { useState } from "react";

export default function Tabs({ tabs }) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div role="tablist">
        {tabs.map((tab, i) => {
          return (
            <button
              key={i}
              role="tab"
              aria-selected={i === active}
              aria-controls={`panel-${i}`}
              onClick={() => setActive(i)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      {tabs.map((tab, i) => {
        return (
          <div key={i} role="tabpanel" id={`panel-${i}`} hidden={i !== active}>
            {tab.content}
          </div>
        );
      })}
    </div>
  );
}
