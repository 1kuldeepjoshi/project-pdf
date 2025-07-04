let imageNumber = 0;
let uploadedImages = [];
let pdfBytes = null;

document.getElementById("upload-file").addEventListener("change", handleFileUpload);
document.getElementById("convertBtn").addEventListener("click", convertToPdf);
document.getElementById("downloadBtn").addEventListener("click", downloadPdf);

function handleFileUpload(event) {
  const files = Array.from(event.target.files);
  const uploadedImagesContainer = document.getElementById("uploadedImagesContainer");
  const uploadContainer = document.getElementById("uploadContainer");
  const addImageBtnContainer = document.getElementById("addImageBtnContainer");
  const descriptionContainer = document.querySelector(".description-container");

  uploadContainer.style.display = "none";
  descriptionContainer.style.display = "none";
  uploadedImagesContainer.style.display = "flex";
  addImageBtnContainer.style.display = "flex";

  const fileReadPromises = files.map((file, index) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve({ file, dataURL: e.target.result, index });
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  });

  Promise.all(fileReadPromises).then((results) => {
    results.sort((a, b) => a.index - b.index);
    results.forEach((result) => {
      imageNumber++;
      const imageWrapper = createImageWrapper(result.file.name, result.dataURL, imageNumber);
      uploadedImagesContainer.appendChild(imageWrapper);
      uploadedImages.push({
        id: imageNumber,
        src: result.dataURL,
        element: imageWrapper,
      });
    });
    document.getElementById("convertBtn").style.display = "block";
  });
}

function createImageWrapper(fileName, src, id) {
  const wrapper = document.createElement("div");
  wrapper.classList.add("uploaded-image");
  wrapper.setAttribute("data-id", id);

  const numElem = document.createElement("div");
  numElem.classList.add("uploaded-image-number");
  numElem.innerText = `#${id}`;

  const img = document.createElement("img");
  img.src = src;
  img.setAttribute("data-rotation", "0");
  img.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleActionButtons(img);
  });

  const container = document.createElement("div");
  container.classList.add("image-container");
  container.appendChild(img);

  const nameElem = document.createElement("div");
  nameElem.classList.add("uploaded-image-name");
  nameElem.innerText = fileName;

  const actions = createActions(img, wrapper, src);

  wrapper.appendChild(numElem);
  wrapper.appendChild(container);
  wrapper.appendChild(nameElem);
  wrapper.appendChild(actions);

  return wrapper;
}

function createActions(imgElem, wrapper, src) {
  const div = document.createElement("div");
  div.classList.add("image-actions");

  const actions = [
    { icon: "eye", label: "Preview", handler: () => previewImage(imgElem) },
    { icon: "pencil", label: "Edit", handler: () => editImage(src) },
    { icon: "rotate-right", label: "Rotate", handler: () => rotateImage(imgElem) },
    { icon: "trash", label: "Delete", handler: () => deleteImage(wrapper.getAttribute("data-id")) },
  ];

  actions.forEach(({ icon, label, handler }) => {
    const btn = document.createElement("button");
    btn.classList.add("action-btn");
    btn.innerHTML = `<i class="fa fa-${icon}"></i><span class="btn-label">${label}</span>`;
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      handler();
    });
    div.appendChild(btn);
  });

  return div;
}

function toggleActionButtons(imgElem) {
  document.querySelectorAll(".image-actions").forEach((div) => {
    div.style.display = "none";
  });
  const wrapper = imgElem.closest(".uploaded-image");
  const actionsDiv = wrapper.querySelector(".image-actions");
  actionsDiv.style.display = actionsDiv.style.display === "flex" ? "none" : "flex";
}

document.addEventListener("click", (e) => {
  if (!e.target.closest(".uploaded-image")) {
    document.querySelectorAll(".image-actions").forEach((el) => (el.style.display = "none"));
  }
});

function deleteImage(imageId) {
  const index = uploadedImages.findIndex((img) => img.id == imageId);
  if (index !== -1) {
    uploadedImages[index].element.remove();
    uploadedImages.splice(index, 1);
    updateImageOrder();
  }
}

function rotateImage(imgElem) {
  let rot = parseInt(imgElem.getAttribute("data-rotation") || "0", 10);
  rot = (rot + 90) % 360;
  imgElem.style.transform = `rotate(${rot}deg)`;
  imgElem.setAttribute("data-rotation", rot);
  const cont = imgElem.parentElement;
  let w = parseFloat(imgElem.dataset.origWidth) || parseFloat(getComputedStyle(imgElem).width);
  let h = parseFloat(imgElem.dataset.origHeight) || parseFloat(getComputedStyle(imgElem).height);
  cont.style.width = rot === 90 || rot === 270 ? `${h}px` : `${w}px`;
  cont.style.height = rot === 90 || rot === 270 ? `${w}px` : `${h}px`;
}

function updateImageOrder() {
  const container = document.getElementById("uploadedImagesContainer");
  const children = Array.from(container.children);
  uploadedImages = children.map((child) =>
    uploadedImages.find((img) => img.id == child.getAttribute("data-id"))
  );
  children.forEach((child, index) => {
    const numberElem = child.querySelector(".uploaded-image-number");
    if (numberElem) numberElem.innerText = `#${index + 1}`;
  });
}

function editImage(dataURL) {
  window.location.href = "edit.html?img=" + encodeURIComponent(dataURL);
}

document.addEventListener("DOMContentLoaded", () => {
  Sortable.create(document.getElementById("uploadedImagesContainer"), {
    animation: 150,
    onEnd: updateImageOrder,
  });
});
