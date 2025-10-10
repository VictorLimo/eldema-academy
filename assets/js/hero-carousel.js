(function () {
  // Resolve the images folder relative to this script so it works from any page
  const scriptSrc =
    (document.currentScript && document.currentScript.src) ||
    window.location.href;
  const imageFolder = new URL("../images/gallery/sports-day/", scriptSrc).href;
  const images = [
    "1738753971198.jpg",
    "sc1.jpg",
    "sc2.jpg",
    "sc3.jpg",
    "sc4.jpg",
    "sc5.jpg",
    "sc6.jpg",
    "sc7.jpg",
    "sc8.jpg",
    "sc9.jpg",
    "sc10.jpg",
    "img1.jpg",
  ];

  const slideInterval = 4000; // ms
  let current = 0;
  let timer = null;

  function createSlide(url, idx) {
    const div = document.createElement("div");
    div.className = "slide";
    // Wrap URL in quotes to handle spaces and parentheses correctly in CSS
    div.style.backgroundImage = `url("${url}")`;
    div.dataset.index = idx;
    // Preload image to detect loading errors (CSS background-image doesn't fire error events)
    const imgProbe = new Image();
    imgProbe.onload = function () {
      console.debug(
        "Hero image preloaded:",
        url,
        imgProbe.naturalWidth,
        imgProbe.naturalHeight
      );
    };
    imgProbe.onerror = function () {
      console.error("Hero slide failed to load:", url);
      // Try encoded filename or cache-bust
      const attempts = [
        function () {
          div.style.backgroundImage = `url("${encodeURI(url)}")`;
        },
        function () {
          div.style.backgroundImage = `url("${url.replace(
            /%20/g,
            " "
          )}?cb=${Date.now()}")`;
        },
      ];
      // run attempts sequentially
      attempts.forEach((fn) => {
        try {
          fn();
        } catch (e) {
          console.error(e);
        }
      });
      // Final attempt: fetch with cache reload to bypass corrupted cached (304) responses
      if (!div.__didFetchReload) {
        div.__didFetchReload = true;
        fetch(url, { cache: "no-store" })
          .then(function (res) {
            console.debug(
              "Hero fetch-reload response for",
              url,
              "status",
              res.status,
              "len",
              res.headers.get("content-length")
            );
            if (!res.ok) throw new Error("Fetch failed: " + res.status);
            return res.blob();
          })
          .then(function (blob) {
            const blobUrl = URL.createObjectURL(blob);
            div.style.backgroundImage = `url("${blobUrl}")`;
            console.debug("Set hero slide background to fetched blob for", url);
          })
          .catch(function (err) {
            console.error("Fetch-reload also failed for hero slide", url, err);
          });
      }
    };
    imgProbe.src = url;
    return div;
  }

  function renderSlides(container) {
    container.innerHTML = "";
    images.forEach((name, i) => {
      // Encode only the filename part to preserve folder structure
      const url = imageFolder + encodeURIComponent(name);
      const slide = createSlide(url, i);
      if (i === 0) slide.classList.add("active");
      container.appendChild(slide);
    });
  }

  function renderDots(container) {
    container.innerHTML = "";
    images.forEach((_, i) => {
      const dot = document.createElement("div");
      dot.className = "dot" + (i === 0 ? " active" : "");
      dot.dataset.index = i;
      dot.addEventListener("click", () => goTo(i));
      container.appendChild(dot);
    });
  }

  function goTo(i) {
    const slides = document.querySelectorAll(".hero-carousel .slide");
    const dots = document.querySelectorAll(".hero-carousel .dot");
    slides.forEach((s) => s.classList.remove("active"));
    dots.forEach((d) => d.classList.remove("active"));
    slides[i].classList.add("active");
    dots[i].classList.add("active");
    current = i;
    resetTimer();
  }

  function next() {
    const nextIndex = (current + 1) % images.length;
    goTo(nextIndex);
  }

  function startTimer() {
    timer = setInterval(next, slideInterval);
  }

  function resetTimer() {
    if (timer) clearInterval(timer);
    startTimer();
  }

  document.addEventListener("DOMContentLoaded", function () {
    const slidesContainer = document.getElementById("hero-slides");
    const dotsContainer = document.getElementById("hero-dots");
    if (!slidesContainer || !dotsContainer) return;

    renderSlides(slidesContainer);
    renderDots(dotsContainer);
    startTimer();

    // Pause on hover
    const hero = document.querySelector(".hero-carousel");
    hero.addEventListener("mouseenter", () => {
      if (timer) clearInterval(timer);
    });
    hero.addEventListener("mouseleave", () => {
      resetTimer();
    });
  });
})();
