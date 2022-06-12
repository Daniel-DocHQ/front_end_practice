export function capitalize(string) {
  if (typeof string != "string") return "";
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function getNumValue(string) {
  let number = string.match(/\d/g);
  number = number.join("");
  return Number(number);
}

export function style(elem) {
  return window.getComputedStyle(elem);
}

export function css(el, styles = {}) {
  Object.keys(styles).forEach((key) => (el.style[key] = styles[key]));
}
