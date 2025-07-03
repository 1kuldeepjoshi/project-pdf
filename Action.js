import { previewImage, editImage, rotateImage, deleteImage } from "./app.js";

// Build action-button container for each uploaded image
export function createActionButtons(imgElem, dataURL, wrapper) {
  const div = document.createElement("div");
  div.classList.add("image-actions");

  const btnFactory = (icon, label, fn) => {
    const btn = document.createElement("button");
    btn.classList.add("action-btn");
    btn.innerHTML = `<i class="fa fa-${icon}"></i><span class="btn-label">${label}</span>`;
    btn.addEventListener("click", e => { e.stopPropagation(); fn(); });
    return btn;
  };

  div.appendChild(btnFactory("eye","Preview",()=> previewImage(imgElem)));
  div.appendChild(btnFactory("pencil","Edit", () => editImage(dataURL)));
  div.appendChild(btnFactory("rotate-right","Rotate", () => rotateImage(imgElem)));
  div.appendChild(btnFactory("trash","Delete", () => deleteImage(wrapper.dataset.id)));

  return div;
}

// Toggle visibility
export function toggleActionButtons(imgElem) {
  document.querySelectorAll(".image-actions").forEach(d=>d.style.display="none");
  const actionsDiv = imgElem.closest(".uploaded-image").querySelector(".image-actions");
  actionsDiv.style.display = actionsDiv.style.display==="flex"?"none":"flex";
}

// Hide on outside click
document.addEventListener("click", e=> {
  if (!e.target.closest(".uploaded-image"))
    document.querySelectorAll(".image-actions")
            .forEach(d=>d.style.display="none");
});
