// Mobile Menu Toggle
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

if (hamburger) {
  hamburger.addEventListener("click", (e) => {
    e.stopPropagation();
    navMenu.classList.toggle("active");
    hamburger.classList.toggle("active");
  });
}

// Close mobile menu when a link is clicked
const navLinks = document.querySelectorAll(".nav-link");
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("active");
    if (hamburger) hamburger.classList.remove("active");
  });
});

// Close mobile menu when clicking outside
document.addEventListener("click", () => {
  if (navMenu.classList.contains("active")) {
    navMenu.classList.remove("active");
    hamburger.classList.remove("active");
  }
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Newsletter Form Submission
const newsletterForm = document.querySelector(".newsletter-form");
if (newsletterForm) {
  newsletterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = newsletterForm.querySelector('input[type="email"]').value;

    if (email) {
      alert(
        `Thank you for subscribing with ${email}! Check your inbox for exclusive offers.`,
      );
      newsletterForm.reset();
    }
  });
}

// Add to Cart Button Click Handler
const addCartButtons = document.querySelectorAll(".add-cart-btn");
addCartButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    const productCard = e.target.closest(".product-card");
    const productName = productCard.querySelector("h3").textContent;
    const productPrice =
      productCard.querySelector(".product-price").textContent;

    showNotification(`${productName} added to cart! (${productPrice})`);

    // Add animation
    button.textContent = "✓ Added!";
    button.style.backgroundColor = "#2D5016";
    setTimeout(() => {
      button.textContent = "Add to Cart";
      button.style.backgroundColor = "";
    }, 2000);
  });
});

// Shop Now Button
const shopBtn = document.querySelector(".shop-btn");
if (shopBtn) {
  shopBtn.addEventListener("click", () => {
    document.querySelector("#products").scrollIntoView({ behavior: "smooth" });
  });
}

// Explore Range Button
const exploreBtn = document.querySelector(".primary-btn");
if (exploreBtn) {
  exploreBtn.addEventListener("click", () => {
    document.querySelector("#products").scrollIntoView({ behavior: "smooth" });
  });
}

// Notification Function
function showNotification(message) {
  const notification = document.createElement("div");
  notification.textContent = message;
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #1e5631, #52b788);
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        z-index: 2000;
        animation: slideIn 0.3s ease-out;
    `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease-out";
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Add animation styles
const style = document.createElement("style");
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Scroll to Top Button
function createScrollToTopButton() {
  const scrollBtn = document.createElement("button");
  scrollBtn.innerHTML = "↑";
  scrollBtn.className = "scroll-to-top";
  scrollBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, #1e5631, #52b788);
        color: white;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        display: none;
        z-index: 999;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        transition: all 0.3s ease;
    `;

  document.body.appendChild(scrollBtn);

  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 300) {
      scrollBtn.style.display = "block";
    } else {
      scrollBtn.style.display = "none";
    }
  });

  scrollBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  scrollBtn.addEventListener("mouseover", () => {
    scrollBtn.style.transform = "scale(1.1)";
  });

  scrollBtn.addEventListener("mouseout", () => {
    scrollBtn.style.transform = "scale(1)";
  });
}

createScrollToTopButton();

// Fade In Animation on Scroll
function observeElements() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.animation = "fadeIn 0.6s ease-out forwards";
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document
    .querySelectorAll(".product-card, .benefit-card, .contact-card")
    .forEach((el) => {
      observer.observe(el);
    });
}

const fadeInStyle = document.createElement("style");
fadeInStyle.textContent = `
    .product-card, .benefit-card, .contact-card {
        opacity: 0;
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(fadeInStyle);

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  observeElements();
});

// Product filtering (optional - can be expanded)
function filterProducts(category) {
  const products = document.querySelectorAll(".product-card");
  products.forEach((product) => {
    if (category === "all" || product.dataset.category === category) {
      product.style.display = "block";
    } else {
      product.style.display = "none";
    }
  });
}

// Smooth transition for nav links
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("mousedown", function () {
    this.style.opacity = "0.7";
  });

  link.addEventListener("mouseup", function () {
    this.style.opacity = "1";
  });
});

// Add loading state to buttons
document
  .querySelectorAll(".primary-btn, .shop-btn, .add-cart-btn")
  .forEach((btn) => {
    btn.addEventListener("mousedown", function () {
      this.style.transform = "scale(0.98)";
    });

    btn.addEventListener("mouseup", function () {
      this.style.transform = "";
    });
  });

console.log("Fresh Care Foods website loaded successfully!");
