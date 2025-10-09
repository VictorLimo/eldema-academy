(function () {
  const imageFolder = "./assets/images/gallery/sports-day/";
  const images = [
    "1738753971198.jpg",
    "DSC_0357.JPG",
    "DSC_0358.JPG",
    "DSC_0359.JPG",
    "DSC_0360.JPG",
    "DSC_0377.JPG",
    "DSC_0413 (1).JPG",
    "DSC_0419 (1).JPG",
    "DSC_0454.JPG",
    "DSC_0500.JPG",
    "DSC_0517.JPG",
    "img1.jpg",
    "img6.jpg",
  ];

  const slideInterval = 4000; // ms
  let current = 0;
  let timer = null;

  function createSlide(url, idx) {
    const div = document.createElement("div");
    div.className = "slide";
    div.style.backgroundImage = `url(${url})`;
    div.dataset.index = idx;
    return div;
  }

  function renderSlides(container) {
    container.innerHTML = "";
    images.forEach((name, i) => {
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
