export default function TransferControls({
  selectedRight,
  selectedLeft,
  onMoveRight,
  onMoveLeft,
}) {
  return (
    <div>
      <button
        type="button"
        aria-label="move to left"
        disabled={selectedRight.size === 0}
        onClick={() => onMoveLeft(selectedRight)}
      >
        {"<-"}
      </button>
      <button
        type="button"
        aria-label="move to right"
        disabled={selectedLeft.size === 0}
        onClick={() => onMoveRight(selectedLeft)}
      >
        {"->"}
      </button>
    </div>
  );
}
