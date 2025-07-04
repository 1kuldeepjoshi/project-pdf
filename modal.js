let currentZoomLevel = 1;

document.addEventListener("DOMContentLoaded", () => {
  const modalImg = document.getElementById("previewModalImage");

  document.getElementById("modalClose").addEventListener("click", () => {
    document.getElementById("previewModal").style.display = "none";
  });

  document.getElementById("modalZoomIn").addEventListener("click", () => {
    if (currentZoomLevel < 3) {
      currentZoomLevel += 0.2;
      modalImg.style.transform = `scale(${currentZoomLevel})`;
      document.getElementById("modalZoomOut").style.display = "block";
    }
  });

  document.getElementById("modalZoomOut").addEventListener("click", () => {
    if (currentZoomLevel > 1) {
      currentZoomLevel -= 0.2;
      if (currentZoomLevel <= 1) {
        currentZoomLevel = 1;
        document.getElementById("modalZoomOut").style.display = "none";
      }
      modalImg.style.transform = `scale(${currentZoomLevel})`;
    }
  });

  document.getElementById("modalEdit").addEventListener("click", () => {
    window.location.href =
      "edit.html?img=" + encodeURIComponent(modalImg.src);
  });
});

/**
 * Open the preview modal with the given image
 * @param {HTMLImageElement} imgElem
 */
function previewImage(imgElem) {
  const modal = document.getElementById("previewModal");
  const modalImg = document.getElementById("previewModalImage");
  modalImg.src = imgElem.src;
  modalImg.style.transform = "scale(1)";
  currentZoomLevel = 1;
  modal.style.display = "flex";
}
