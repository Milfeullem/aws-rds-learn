export default function widgetRoles() {
  return (
    <div role="button" tabIndex={0}></div>

    <div role="checkbox" tabIndex={0} aria-checked="false"></div>

    <div role="radiogroup">
      <div role="radio" tabIndex={0} aria-checked="true"></div>
      <div role="radio" tabIndex={-1} aria-checked="false"></div>
    </div>

    <div role="slider" aria-valuemax="100" aria-valuemin="0" aria-valuenow="50" aria-label="volume" tabIndex={0}>
      <div style="width:50%"></div>
    </div>
  )
}