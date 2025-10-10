(function () {
  const imageFolder = "/assets/images/gallery/sports-day/";

  const images = [
    "1738753971198.jpg",
    "DSC_0357.jpg",
    "DSC_0358.jpg",
    "DSC_0359.jpg",
    "DSC_0360.jpg",
    "DSC_0377.jpg",
    "DSC_0413 (1).jpg",
    "DSC_0419 (1).jpg",
    "DSC_0454.jpg",
    "DSC_0500.jpg",
    "DSC_0517.jpg",
    "img1.jpg",
    "img6.jpg",
  ];

  function createGalleryItem(src, alt) {
    const col = document.createElement("div");
    col.className = "gallery-item";

    const img = document.createElement("img");
    img.src = src;
    img.alt = alt || "";
    img.className = "img-fluid rounded shadow-sm";
    img.style.cursor = "pointer";

    col.appendChild(img);

    img.addEventListener("click", function () {
      openLightbox(src, alt);
    });

    return col;
  }

  function openLightbox(src, alt) {
    let overlay = document.getElementById("gallery-lightbox");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "gallery-lightbox";
      overlay.style.position = "fixed";
      overlay.style.top = "0";
      overlay.style.left = "0";
      overlay.style.width = "100%";
      overlay.style.height = "100%";
      overlay.style.background = "rgba(0,0,0,0.85)";
      overlay.style.display = "flex";
      overlay.style.alignItems = "center";
      overlay.style.justifyContent = "center";
      overlay.style.zIndex = "2000";

      const img = document.createElement("img");
      img.id = "gallery-lightbox-img";
      img.style.maxWidth = "95%";
      img.style.maxHeight = "90%";
      img.style.boxShadow = "0 10px 30px rgba(0,0,0,0.6)";
      img.style.borderRadius = "6px";
      overlay.appendChild(img);

      // close on click outside image
      overlay.addEventListener("click", function (e) {
        if (e.target === overlay) closeLightbox();
      });

      // close on ESC
      document.addEventListener("keydown", function onKey(e) {
        if (e.key === "Escape") closeLightbox();
      });

      document.body.appendChild(overlay);
    }

    const imgEl = document.getElementById("gallery-lightbox-img");
    imgEl.src = src;
    imgEl.alt = alt || "";

    overlay.style.display = "flex";
  }

  function closeLightbox() {
    const overlay = document.getElementById("gallery-lightbox");
    if (overlay) overlay.style.display = "none";
  }

  document.addEventListener("DOMContentLoaded", function () {
    const container = document.querySelector(".gallery-content");
    if (!container) return;

    // Clear existing content
    container.innerHTML = "";

    // Apply a responsive grid class if not present
    container.style.display = "grid";
    container.style.gridTemplateColumns =
      "repeat(auto-fit, minmax(240px, 1fr))";
    container.style.gap = "1rem";
    container.style.padding = "1rem";

    images.forEach(function (filename) {
      const path = imageFolder + encodeURIComponent(filename);
      const alt = filename.replace(/[-_\.]/g, " ");
      const item = createGalleryItem(path, alt);
      container.appendChild(item);
    });

    // Lazy load images for performance
    if ("loading" in HTMLImageElement.prototype) {
      document
        .querySelectorAll(".gallery-content img")
        .forEach((img) => img.setAttribute("loading", "lazy"));
    }
  });
})();
