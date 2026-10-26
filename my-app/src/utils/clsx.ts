export default function clsx(...classNames) {
  return classNames.filter(Boolean).join(" ");
}
