/**
 * Rotates the image element clockwise by 90 degrees
 * @param {HTMLImageElement} imgElem
 */
function rotateImage(imgElem) {
  let currentRotation = parseInt(imgElem.getAttribute("data-rotation") || "0", 10);
  currentRotation = (currentRotation + 90) % 360;
  imgElem.style.transform = `rotate(${currentRotation}deg)`;
  imgElem.setAttribute("data-rotation", currentRotation);

  const container = imgElem.parentElement;
  const origWidth = parseFloat(imgElem.dataset.origWidth) || parseFloat(getComputedStyle(imgElem).width);
  const origHeight = parseFloat(imgElem.dataset.origHeight) || parseFloat(getComputedStyle(imgElem).height);

  if (currentRotation === 90 || currentRotation === 270) {
    container.style.width = `${origHeight}px`;
    container.style.height = `${origWidth}px`;
  } else {
    container.style.width = `${origWidth}px`;
    container.style.height = `${origHeight}px`;
  }
}
