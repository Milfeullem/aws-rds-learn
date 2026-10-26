export default function AriaLabel() {
  return (
    <>
      <button aria-label="Close dialog"></button>

      <div role="dialog" aria-modal="" aria-describedby="dialog-title">
        <h2 id="dialog-title">Confirm Deletion</h2>
      </div>

      <input aria-label="password" aria-describedby="password-rules"></input>
      <div id="password-rules">Must be at lest 8 characters</div>
    </>
  );
}
