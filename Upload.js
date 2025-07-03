let imageNumber = 0;
let uploadedImages = [];

export function handleFileUpload(event) {
  const files = Array.from(event.target.files);
  const uploadedImagesContainer = document.getElementById("uploadedImagesContainer");
  const uploadContainer = document.getElementById("uploadContainer");
  const addImageBtnContainer = document.getElementById("addImageBtnContainer");
  const descriptionContainer = document.querySelector(".description-container");

  uploadContainer.style.display = "none";
  descriptionContainer.style.display = "none";
  uploadedImagesContainer.style.display = "flex";
  addImageBtnContainer.style.display = "flex";

  const readers = files.map((file, idx) => new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = e => res({ file, dataURL: e.target.result, idx });
    r.onerror = rej;
    r.readAsDataURL(file);
  }));

  Promise.all(readers).then(results => {
    results.sort((a,b)=>a.idx-b.idx)
           .forEach(({file,dataURL}) => {
      imageNumber++;
      // build DOM...
      const wrapper = document.createElement("div");
      wrapper.classList.add("uploaded-image");
      wrapper.dataset.id = imageNumber;

      const numberEl = document.createElement("div");
      numberEl.classList.add("uploaded-image-number");
      numberEl.innerText = `#${imageNumber}`;

      const imgCont = document.createElement("div");
      imgCont.classList.add("image-container");

      const img = document.createElement("img");
      img.src = dataURL;
      img.dataset.rotation = 0;
      img.addEventListener("click", e => {
        e.stopPropagation();
        toggleActionButtons(img);
      });
      img.onload = () => {
        const style = window.getComputedStyle(img);
        img.dataset.origWidth  = style.width;
        img.dataset.origHeight = style.height;
        imgCont.style.width  = style.width;
        imgCont.style.height = style.height;
      };

      const nameEl = document.createElement("div");
      nameEl.classList.add("uploaded-image-name");
      nameEl.innerText = file.name;

      wrapper.append(numberEl, imgCont, nameEl);
      imgCont.appendChild(img);
      // attach action buttons…
      const actions = createActionButtons(img, dataURL, wrapper);
      wrapper.appendChild(actions);

      uploadedImagesContainer.appendChild(wrapper);
      uploadedImages.push({ id:imageNumber, src:dataURL, element:wrapper });
    });
    document.getElementById("convertBtn").style.display = "block";
  });
}
