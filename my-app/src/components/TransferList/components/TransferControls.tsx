export default function TransferControls({
  canMoveRight,
  canMoveLeft,
  canMoveAllRight,
  canMoveAllLeft,
  onMoveRight,
  onMoveLeft,
  onMoveAllRight,
  onMoveAllLeft,
}: {
  canMoveRight: boolean;
  canMoveLeft: boolean;
  canMoveAllRight: boolean;
  canMoveAllLeft: boolean;
  onMoveRight: () => void;
  onMoveLeft: () => void;
  onMoveAllRight: () => void;
  onMoveAllLeft: () => void;
}) {
  return (
    <div className="transfer-controls" role="group" aria-label="Transfer actions">
      <button type="button" disabled={!canMoveRight} onClick={onMoveRight}>
        &gt;
        <span className="sr-only">Move selected to right</span>
      </button>
      <button type="button" disabled={!canMoveAllRight} onClick={onMoveAllRight}>
        &gt;&gt;
        <span className="sr-only">Move all to right</span>
      </button>
      <button type="button" disabled={!canMoveLeft} onClick={onMoveLeft}>
        &lt;
        <span className="sr-only">Move selected to left</span>
      </button>
      <button type="button" disabled={!canMoveAllLeft} onClick={onMoveAllLeft}>
        &lt;&lt;
        <span className="sr-only">Move all to left</span>
      </button>
    </div>
  );
}
