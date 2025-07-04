let currentIndex = 0;
let images = [];
let currentZoom = 1;
let currentRotation = 0;

function openPreview(index, imgList) {
  images = imgList;
  currentIndex = index;
  currentZoom = 1;
  currentRotation = 0;

  const img = images[index];
  const preview = document.getElementById("previewImage");

  preview.src = img.src;
  preview.style.transform = "scale(1) rotate(0deg)";
  document.getElementById("imgName").textContent = img.name || "Untitled";
  document.getElementById("imgSize").textContent = img.size || "";

  document.getElementById("previewModal").style.display = "flex";
}

function closePreview() {
  document.getElementById("previewModal").style.display = "none";
}

function rotateImage(degrees) {
  currentRotation += degrees;
  document.getElementById("previewImage").style.transform =
    `scale(${currentZoom}) rotate(${currentRotation}deg)`;
}

function zoomImage(factor) {
  currentZoom *= factor;
  document.getElementById("previewImage").style.transform =
    `scale(${currentZoom}) rotate(${currentRotation}deg)`;
}

function showImage(index) {
  if (index < 0 || index >= images.length) return;
  currentIndex = index;
  currentZoom = 1;
  currentRotation = 0;
  openPreview(index, images);
}

document.getElementById("modalPrev").onclick = () => showImage(currentIndex - 1);
document.getElementById("modalNext").onclick = () => showImage(currentIndex + 1);

function downloadImage() {
  const img = images[currentIndex];
  const link = document.createElement("a");
  link.href = img.src;
  link.download = img.name || "image.jpg";
  link.click();
}

// Keyboard navigation
document.addEventListener("keydown", (e) => {
  const modal = document.getElementById("previewModal");
  if (modal.style.display !== "flex") return;

  if (e.key === "ArrowRight") showImage(currentIndex + 1);
  else if (e.key === "ArrowLeft") showImage(currentIndex - 1);
  else if (e.key === "Escape") closePreview();
});
