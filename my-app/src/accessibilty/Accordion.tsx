export default function Accordion() {
  return (
    <div>
      <h3>
        <button aria-expanded={isOpen} aria-controls="content-1">
          Section 1
        </button>
      </h3>
      <div id="content-1" hidden={!isOpen} role="region">
        Content
      </div>
    </div>
  );
}
