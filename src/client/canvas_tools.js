export function scaleCanvas(element, width, height) {
  const context = element.getContext('2d');
  const ratio = getRatio(context);
  element.style.width = width;
  element.style.height = height;
  element.width = width * ratio;
  element.height = height * ratio;
  context.scale(ratio, ratio);
}

export function getRatio(context) {
  const devicePixelRatio = window.devicePixelRatio || 1;
  const backingStoreRatio = context.webkitBackingStorePixelRatio ||
    context.mozBackingStorePixelRatio ||
    context.msBackingStorePixelRatio ||
    context.oBackingStorePixelRatio ||
    context.backingStorePixelRatio || 1;
  return devicePixelRatio / backingStoreRatio;
}
