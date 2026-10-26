export default function Menu() {
  return (
    <div role="menu">
      <div role="menuitem" tabIndex={0}></div>
      <div role="menuitem" tabIndex={-1}></div>
      <div role="separator"></div>
      <div role="menuitem" tabIndex={-1}></div>
    </div>
  );
}
