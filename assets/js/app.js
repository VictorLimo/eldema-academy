/**
 * =================================================================
 * 1. Component Reusability Function
 * =================================================================
 * Loads an external HTML component and injects it into a target element.
 * Includes robust error handling for network or file issues.
 */
async function loadComponent(url, elementId) {
  try {
    const response = await fetch(url);
    // Check for HTTP errors
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const html = await response.text();
    const placeholder = document.getElementById(elementId);
    if (placeholder) {
      placeholder.innerHTML = html;
    } else {
      console.error(`Placeholder element with ID "${elementId}" not found.`);
    }
  } catch (error) {
    console.error(`Failed to load component from ${url}:`, error);
    // Display a fallback message to the user
    const placeholder = document.getElementById(elementId);
    if (placeholder) {
      placeholder.innerHTML =
        '<p class="text-danger">Error loading content.</p>';
    }
  }
}

/**
 * =================================================================
 * 2. Main DOM Content Loaded Handler
 * =================================================================
 * Consolidates all page initializations: component loading, modal setup,
 * scroll effects, and carousel initialization.
 */
document.addEventListener("DOMContentLoaded", () => {

  // --- B. Modal Logic ---
  const modalHTML = `
      <div class="modal-overlay" id="volunteerModalOverlay">
        <div class="v-modal-content">
          <button class="modal-close-button" id="closeVolunteerModal">&times;</button>
          <div class="modal-header">
            <h2>Volunteer at Eldema Letap Academy!</h2>
          </div>
          <div class="modal-body">
            <p>Are you passionate about making a difference? Eldema Letap Academy is looking for enthusiastic volunteers in various fields to help us achieve our mission.</p>
            <p>Your skills and time can help shape brighter futures!</p>
          </div>
          <a href="https://eldemaletapacademy.org/volunteering/" class="modal-cta-button">Learn More & Volunteer</a>
        </div>
      </div>
    `;

  if (localStorage.getItem("eldemaVolunteerModalShown") !== "true") {
    document.body.insertAdjacentHTML("beforeend", modalHTML);

    const volunteerModalOverlay = document.getElementById(
      "volunteerModalOverlay"
    );
    const closeVolunteerModalButton = document.getElementById(
      "closeVolunteerModal"
    );

    function showModal() {
      volunteerModalOverlay.classList.add("active");
    }

    function hideModal() {
      volunteerModalOverlay.classList.remove("active");
      localStorage.setItem("eldemaVolunteerModalShown", "true");
    }

    // Add event listeners only after the element is inserted
    if (closeVolunteerModalButton) {
      closeVolunteerModalButton.addEventListener("click", hideModal);
    }

    if (volunteerModalOverlay) {
      volunteerModalOverlay.addEventListener("click", function (event) {
        // Close only if the click is directly on the overlay (not the content box)
        if (event.target === volunteerModalOverlay) {
          hideModal();
        }
      });
      // Show the modal
      showModal();
    }
  }

  // --- C. Scroll Reveal Effect (Intersection Observer) ---
  const scrollRevealElements = document.querySelectorAll(".scroll-reveal");

  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        observer.unobserve(entry.target); // Stop observing once revealed
      }
    });
  }, observerOptions);

  scrollRevealElements.forEach((el) => {
    // Only observe elements that haven't been revealed yet
    if (!el.classList.contains("revealed")) {
      observer.observe(el);
    }
  });

  // --- D. Bootstrap Carousel Initialization ---
  const reviewCarouselElement = document.getElementById("reviewCarousel");
  if (typeof bootstrap !== "undefined" && reviewCarouselElement) {
    const reviewCarousel = new bootstrap.Carousel(reviewCarouselElement, {
      interval: 5000,
      wrap: true,
    });
  }
});

// async function loadGalleryImages() {
//     const galleryContainer = document.querySelector('.gallery-content');
//     if (!galleryContainer) return;

//     try {
//         const response = await fetch('/.netlify/functions/list-gallery-images'); 
        
//         if (!response.ok) {
//             throw new Error(`HTTP error! Status: ${response.status}`);
//         }
        
//         // The response body is the array of image filenames
//         const imageFiles = await response.json();

//         let imageMarkup = '';
//         imageFiles.forEach(fileName => {
//             const imagePath = `../assets/images/gallery/${fileName}`;
//             imageMarkup += `<img src="${imagePath}" alt="Eldema Letap Academy Gallery Photo" class="scroll-reveal fade-in">`;
//         });

//         galleryContainer.innerHTML = imageMarkup;
        
//         if (typeof initializeScrollReveal === 'function') {
//              initializeScrollReveal(); 
//         }
        
//     } catch (error) {
//         console.error('Failed to load gallery images:', error);
//         galleryContainer.innerHTML = '<p class="text-danger text-center p-5">Could not load gallery images. Please check the function deployment.</p>';
//     }
// }

// Init
document.addEventListener('DOMContentLoaded', () => {
  // --- A. Load Reusable Components ---
  loadComponent("/components/nav.html", "nav");
  loadComponent("/components/footer.html", "footer-placeholder");

  // load gallery
  if (document.querySelector('.gallery-content')) {
        loadGalleryImages();
    }
});


/**
 * =================================================================
 * 3. Form Submission Handler for Volunteer Application
 * =================================================================
 * Handles asynchronous submission of the volunteer form.
 */
document.addEventListener("DOMContentLoaded", () => {
  const applicationForm = document.getElementById("volunteer-application");

  if (applicationForm) {
    applicationForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const submitButton = applicationForm.querySelector(".submit-button");
      const originalButtonText = submitButton
        ? submitButton.textContent
        : "Submit";

      // 1. Client-Side Validation
      const consentCheckbox = document.getElementById("consent");
      if (consentCheckbox && !consentCheckbox.checked) {
        alert(
          "Please confirm you agree to the Program Fees and Requirements before submitting."
        );
        return;
      }

      // 2. Disable Button & Provide Feedback
      if (submitButton) {
        submitButton.textContent = "Submitting...";
        submitButton.disabled = true;
      }

      // 3. Prepare Data
      const formData = new FormData(applicationForm);
      const data = {};
      formData.forEach((value, key) => (data[key] = value));

      // 4. Asynchronous Submission
      try {
        const response = await fetch("/.netlify/functions/submit-application", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          // Success Handler
          applicationForm.innerHTML = `
                        <div class="success-message text-center">
                            <i class="bi bi-check-circle-fill" style="font-size: 4rem; color: var(--color-primary);"></i>
                            <h3 style="color: var(--color-primary); margin-top: 15px;">Application Submitted Successfully!</h3>
                            <p>Thank you for applying to volunteer with Eldema Letap Academy. We have received your information and will send you a placement confirmation via email within 48 hours.</p>
                        </div>
                    `;
          localStorage.removeItem("eldemaVolunteerModalShown");
        } else {
          let errorData = {};
          try {
            errorData = await response.json();
          } catch {
            errorData.message = `Server responded with status ${response.status}. The error message could not be read.`;
          }

          throw new Error(
            errorData.message ||
              `Submission failed with status: ${response.status}`
          );
        }
      } catch (error) {
        console.error("Submission Error:", error);
        alert(
          `There was an issue submitting your application. Please check your network connection or try again later. Details: ${error.message}`
        );

        // Restore Button State
        if (submitButton) {
          submitButton.textContent = originalButtonText;
          submitButton.disabled = false;
        }
      }
    });
  }
});
