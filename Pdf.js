let pdfBytes = null;

export async function convertToPdf() {
  const { PDFDocument, degrees } = PDFLib;

  if (window.uploadedImages.length===0) {
    return alert("Please upload at least one image!");
  }
  document.getElementById("loader-overlay").style.display="flex";

  try {
    const pdfDoc = await PDFDocument.create();

    for (let img of window.uploadedImages) {
      const res = await fetch(img.src);
      const arr = await res.arrayBuffer();
      const mime = img.src.match(/^data:(image\/[a-zA-Z]+);base64,/);
      const embedded = mime[1]==="image/png"
                     ? await pdfDoc.embedPng(arr)
                     : await pdfDoc.embedJpg(arr);

      const rot = parseInt(img.element.querySelector("img")
                        .getAttribute("data-rotation"),10)%360;
      let page, w=embedded.width, h=embedded.height;

      if (rot===90||rot===270) [w,h]=[h,w];

      page = pdfDoc.addPage([w,h]);
      page.drawImage(embedded, {
        x: (rot===180?h:0),
        y: (rot===90?w: rot===270?0:0),
        width: embedded.width,
        height: embedded.height,
        rotate: degrees((360-rot)%360)
      });
    }

    pdfBytes = await pdfDoc.save();
    document.getElementById("downloadBtn").style.display="block";
  }
  catch(err) {
    console.error(err);
    alert("An error occurred while creating the PDF.");
  }
  finally {
    document.getElementById("loader-overlay").style.display="none";
  }
}

export function downloadPdf() {
  if (!pdfBytes) return alert("No PDF to download!");
  download(pdfBytes, "images.pdf", "application/pdf");
}
