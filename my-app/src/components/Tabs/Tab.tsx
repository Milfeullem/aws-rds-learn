import { useRef, useState, type KeyboardEvent } from "react";
import type { TabsProps } from "./types";

function resolveDefaultTab(
  tabs: TabsProps["tabs"],
  defaultTab?: string,
): string {
  if (defaultTab && tabs.some((tab) => tab.id === defaultTab)) {
    return defaultTab;
  }
  return tabs[0]?.id ?? "";
}

export default function Tab({
  tabs,
  defaultTab,
  label = "Tabs",
}: TabsProps) {
  const [active, setActive] = useState(() =>
    resolveDefaultTab(tabs, defaultTab),
  );
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  if (tabs.length === 0) return null;

  const activate = (id: string) => {
    setActive(id);
    tabRefs.current.get(id)?.focus();
  };

  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const index = tabs.findIndex((tab) => tab.id === active);
    if (index < 0) return;

    let nextIndex: number | null = null;

    switch (event.key) {
      case "ArrowRight":
        nextIndex = (index + 1) % tabs.length;
        break;
      case "ArrowLeft":
        nextIndex = (index - 1 + tabs.length) % tabs.length;
        break;
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = tabs.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    activate(tabs[nextIndex].id);
  };

  return (
    <div className="tabs">
      <div role="tablist" aria-label={label}>
        {tabs.map(({ id, label: tabLabel }) => {
          const isActive = id === active;

          return (
            <button
              key={id}
              ref={(el) => {
                if (el) tabRefs.current.set(id, el);
                else tabRefs.current.delete(id);
              }}
              type="button"
              role="tab"
              id={id}
              tabIndex={isActive ? 0 : -1}
              className={isActive ? "tab-header active" : "tab-header"}
              aria-selected={isActive}
              aria-controls={`${id}-panel`}
              onClick={() => activate(id)}
              onKeyDown={onTabKeyDown}
            >
              {tabLabel}
            </button>
          );
        })}
      </div>
      {tabs.map(({ id, content }) => {
        const isActive = id === active;

        return (
          <div
            key={id}
            id={`${id}-panel`}
            role="tabpanel"
            aria-labelledby={id}
            tabIndex={0}
            hidden={!isActive}
          >
            {content}
          </div>
        );
      })}
    </div>
  );
}
