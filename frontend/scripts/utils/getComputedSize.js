export default function (selector) {
  const style = window.getComputedStyle(document.querySelector(selector));
  return [parseInt(style.width, 10), parseInt(style.height, 10)];
}
