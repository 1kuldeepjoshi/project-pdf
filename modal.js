let currentIndex = 0;
let imageList = [];
let currentZoom = 1;
let currentRotation = 0;

function openPreview(index, images) {
  const previewModal = document.getElementById("previewModal");
  const previewImage = document.getElementById("previewImage");
  const imgName = document.getElementById("imgName");
  const imgSize = document.getElementById("imgSize");

  currentIndex = index;
  imageList = images;
  currentZoom = 1;
  currentRotation = 0;

  const current = imageList[index];
  previewImage.src = current.src;
  previewImage.style.transform = "scale(1) rotate(0deg)";
  imgName.textContent = current.name || "Untitled";
  imgSize.textContent = current.size || "";

  previewModal.style.display = "flex";
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
  if (index < 0 || index >= imageList.length) return;
  openPreview(index, imageList);
}

document.getElementById("modalPrev").onclick = () => showImage(currentIndex - 1);
document.getElementById("modalNext").onclick = () => showImage(currentIndex + 1);

function downloadImage() {
  const current = imageList[currentIndex];
  const link = document.createElement("a");
  link.href = current.src;
  link.download = current.name || "image.jpg";
  link.click();
}

document.addEventListener("keydown", (e) => {
  const modal = document.getElementById("previewModal");
  if (modal.style.display !== "flex") return;

  if (e.key === "ArrowRight") showImage(currentIndex + 1);
  else if (e.key === "ArrowLeft") showImage(currentIndex - 1);
  else if (e.key === "Escape") closePreview();
});
