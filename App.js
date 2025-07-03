import { handleFileUpload } from "./upload.js";
import { convertToPdf, downloadPdf } from "./pdf.js";
import { toggleActionButtons } from "./actions.js";

window.uploadedImages = [];
let currentZoom = 1;

// Wire up DOM events
document.addEventListener("DOMContentLoaded", ()=>{
  document.getElementById("upload-file")
          .addEventListener("change", handleFileUpload);

  document.getElementById("addImageBtnContainer")
          .querySelector("button")
          .addEventListener("click",
            ()=> document.getElementById("upload-file").click()
          );

  document.getElementById("convertBtn")
          .addEventListener("click", convertToPdf);

  document.getElementById("downloadBtn")
          .addEventListener("click", downloadPdf);

  Sortable.create(
    document.getElementById("uploadedImagesContainer"),
    { animation:150, onEnd: updateOrder }
  );

  // Preview modal buttons
  document.getElementById("modalClose")
          .addEventListener("click", ()=>closePreview());
  document.getElementById("modalZoomIn")
          .addEventListener("click", ()=>zoom(1.2));
  document.getElementById("modalZoomOut")
          .addEventListener("click", ()=>zoom(0.8));
  document.getElementById("modalEdit")
          .addEventListener("click", ()=>{
            const src = document.getElementById("previewModalImage").src;
            window.location.href = `edit.html?img=${encodeURIComponent(src)}`;
          });
});

// Preview / Zoom / Close
export function previewImage(imgElem) {
  const modal = document.getElementById("previewModal");
  const pm   = document.getElementById("previewModalImage");
  pm.src = imgElem.src;
  currentZoom=1;
  pm.style.transform="scale(1)";
  document.getElementById("modalZoomOut").style.display="none";
  modal.style.display="flex";
}
export function closePreview() {
  document.getElementById("previewModal").style.display="none";
}
export function zoom(factor) {
  currentZoom = Math.max(1, Math.min(3, currentZoom*factor));
  const img= document.getElementById("previewModalImage");
  img.style.transform=`scale(${currentZoom})`;
  document.getElementById("modalZoomOut")
          .style.display = currentZoom>1?"block":"none";
}

// Rotate & Delete imported into actions.js

// Re-number images after drag-drop
export function updateOrder() {
  const container = document.getElementById("uploadedImagesContainer");
  const items = Array.from(container.children);
  window.uploadedImages = items.map(div =>
    window.uploadedImages.find(i=>i.id==div.dataset.id)
  );
  items.forEach((div,i) => {
    div.querySelector(".uploaded-image-number").innerText = `#${i+1}`;
  });
}
