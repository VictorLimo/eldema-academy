(function () {
  // Resolve the images folder relative to this script so it works from any page
  const scriptSrc =
    (document.currentScript && document.currentScript.src) ||
    window.location.href;
  const imageFolder = new URL("../images/gallery/sports-day/", scriptSrc).href;

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
    console.debug("Gallery image src set:", src);
    img.alt = alt || "";
    img.className = "img-fluid rounded shadow-sm";
    img.style.cursor = "pointer";

    // If the image fails to load, attempt a few fallbacks and log the failing URL
    img.addEventListener("error", function onImgError() {
      console.error("Gallery image failed to load:", img.src);
      // Try alternative encodings / cache-bust attempts in sequence
      const attempts = [
        // Try encodeURI of full path
        function () {
          img.src = encodeURI(src);
        },
        // Try using unencoded filename (some servers expect raw names)
        function () {
          img.src = src.replace(/%20/g, " ");
        },
        // Try adding a timestamp to bypass caches (last resort)
        function () {
          img.src =
            src + (src.indexOf("?") === -1 ? "?" : "&") + "cb=" + Date.now();
        },
      ];

      // Run next attempt once (avoid infinite loop)
      if (!img.__retryIndex) img.__retryIndex = 0;
      if (img.__retryIndex < attempts.length) {
        const fn = attempts[img.__retryIndex++];
        try {
          fn();
        } catch (e) {
          console.error("Retry error", e);
        }
      } else {
        console.warn("All retries failed for", img.alt || img.src);
        img.removeEventListener("error", onImgError);
      }
    });

    img.addEventListener("load", function () {
      console.debug(
        "Gallery image loaded:",
        img.src,
        "natural size",
        img.naturalWidth,
        img.naturalHeight
      );
    });

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
      // Encode the filename portion to ensure spaces and special chars are safe
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
