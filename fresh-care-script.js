// Dark Mode Toggle
const themeToggle = document.getElementById("themeToggle");
const html = document.documentElement;
const body = document.body;

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem("theme") || "light";
if (currentTheme === "dark") {
  body.classList.add("dark-mode");
  updateThemeIcon("light");
} else {
  updateThemeIcon("dark");
}

function updateThemeIcon(nextTheme) {
  const icon = themeToggle.querySelector(".theme-icon");
  icon.textContent = nextTheme === "dark" ? "🌙" : "☀️";
}

themeToggle.addEventListener("click", () => {
  body.classList.toggle("dark-mode");

  // Update localStorage and icon
  const isDarkMode = body.classList.contains("dark-mode");
  localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  updateThemeIcon(isDarkMode ? "light" : "dark");
});

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

// ========== SHOPPING CART FUNCTIONALITY ==========
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Update cart count in navbar
function updateCartCount() {
  const cartCount = document.querySelector(".cart-count");
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;
}

// Save cart to localStorage
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

// Add to Cart Button Click Handler
const addCartButtons = document.querySelectorAll(".add-cart-btn");
addCartButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    const productCard = e.target.closest(".product-card");
    const productName = productCard.querySelector("h3").textContent;
    const productPriceText =
      productCard.querySelector(".product-price").textContent;
    const productPrice = parseInt(productPriceText.replace(/[^0-9]/g, ""));

    // Check if item already exists in cart
    const existingItem = cart.find((item) => item.name === productName);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        name: productName,
        price: productPrice,
        quantity: 1,
      });
    }

    saveCart();
    showNotification(`${productName} added to cart! (${productPriceText})`);

    // Add animation
    button.textContent = "✓ Added!";
    button.style.backgroundColor = "#2D5016";
    setTimeout(() => {
      button.textContent = "Add to Cart";
      button.style.backgroundColor = "";
    }, 2000);
  });
});

// Render cart items
function renderCart() {
  const cartItemsContainer = document.getElementById("cartItems");

  if (cart.length === 0) {
    cartItemsContainer.innerHTML =
      '<p class="empty-cart-message">Your cart is empty</p>';
    document.getElementById("checkoutBtn").disabled = true;
    updateCartSummary();
    return;
  }

  document.getElementById("checkoutBtn").disabled = false;
  cartItemsContainer.innerHTML = cart
    .map(
      (item, index) => `
    <div class="cart-item">
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <p class="item-price">₹${item.price}/kg</p>
      </div>
      <div class="cart-item-controls">
        <button class="qty-btn" onclick="decreaseQuantity(${index})">−</button>
        <span class="qty-display">${item.quantity}</span>
        <button class="qty-btn" onclick="increaseQuantity(${index})">+</button>
      </div>
      <div class="cart-item-total">
        <p>₹${item.price * item.quantity}</p>
        <button class="remove-btn" onclick="removeFromCart(${index})">Remove</button>
      </div>
    </div>
  `,
    )
    .join("");

  updateCartSummary();
}

// Update quantity functions
function increaseQuantity(index) {
  cart[index].quantity += 1;
  saveCart();
  renderCart();
}

function decreaseQuantity(index) {
  if (cart[index].quantity > 1) {
    cart[index].quantity -= 1;
  } else {
    removeFromCart(index);
    return;
  }
  saveCart();
  renderCart();
}

function removeFromCart(index) {
  const itemName = cart[index].name;
  cart.splice(index, 1);
  saveCart();
  renderCart();
  showNotification(`${itemName} removed from cart`);
}

// Update cart summary (totals)
function updateCartSummary() {
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + tax;

  document.getElementById("subtotal").textContent = `₹${subtotal}`;
  document.getElementById("tax").textContent = `₹${tax}`;
  document.getElementById("total").textContent = `₹${total}`;
}

// Cart Modal Controls
const cartBtn = document.getElementById("cartBtn");
const cartModal = document.getElementById("cartModal");
const closeCartBtn = document.getElementById("closeCartBtn");
const continueShoppingBtn = document.getElementById("continueShoppingBtn");
const checkoutBtn = document.getElementById("checkoutBtn");

if (cartBtn) {
  cartBtn.addEventListener("click", () => {
    cartModal.classList.add("active");
    renderCart();
  });
}

if (closeCartBtn) {
  closeCartBtn.addEventListener("click", () => {
    cartModal.classList.remove("active");
  });
}

if (continueShoppingBtn) {
  continueShoppingBtn.addEventListener("click", () => {
    cartModal.classList.remove("active");
  });
}

if (checkoutBtn) {
  checkoutBtn.addEventListener("click", () => {
    if (cart.length > 0) {
      // Hide cart modal and show checkout form
      cartModal.classList.remove("active");
      document.getElementById("checkoutModal").classList.add("active");

      // Update summary in checkout form
      document.getElementById("summarySubtotal").textContent =
        document.getElementById("subtotal").textContent;
      document.getElementById("summaryTax").textContent =
        document.getElementById("tax").textContent;
      document.getElementById("summaryTotal").textContent =
        document.getElementById("total").textContent;

      // Populate product order textarea
      const productOrderTextarea = document.getElementById("productOrder");
      const productList = cart
        .map((item) => `${item.name} - ${item.quantity} kg`)
        .join("\n");
      productOrderTextarea.value = productList;

      // Display order items
      const itemsList = document.getElementById("checkoutItemsList");
      itemsList.innerHTML = cart
        .map(
          (item, index) => `
        <div class="checkout-item">
          <div class="item-details">
            <h4>${item.name}</h4>
            <p class="item-qty">Quantity: <strong>${item.quantity}</strong> kg</p>
          </div>
          <div class="item-price">
            <p>₹${item.price}/kg</p>
            <p class="item-subtotal">₹${item.price * item.quantity}</p>
          </div>
        </div>
      `,
        )
        .join("");
    }
  });
}

// Checkout Form Handling
const checkoutForm = document.getElementById("checkoutForm");
const checkoutModal = document.getElementById("checkoutModal");
const closeCheckoutBtn = document.getElementById("closeCheckoutBtn");
const backToCartBtn = document.getElementById("backToCartBtn");

if (closeCheckoutBtn) {
  closeCheckoutBtn.addEventListener("click", () => {
    checkoutModal.classList.remove("active");
    cartModal.classList.add("active");
  });
}

if (backToCartBtn) {
  backToCartBtn.addEventListener("click", () => {
    checkoutModal.classList.remove("active");
    cartModal.classList.add("active");
  });
}

if (checkoutForm) {
  checkoutForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("customerName").value.trim();
    const address = document.getElementById("customerAddress").value.trim();
    const contact = document.getElementById("customerContact").value.trim();

    // Validate inputs
    if (!name || !address || !contact) {
      showNotification("Please fill in all fields");
      return;
    }

    if (contact.length !== 10 || isNaN(contact)) {
      showNotification("Please enter a valid 10-digit contact number");
      return;
    }

    // Prepare order details
    const orderDetails = {
      customer: {
        name: name,
        address: address,
        contact: contact,
      },
      items: cart,
      subtotal: parseInt(
        document
          .getElementById("summarySubtotal")
          .textContent.replace(/[^0-9]/g, ""),
      ),
      tax: parseInt(
        document
          .getElementById("summaryTax")
          .textContent.replace(/[^0-9]/g, ""),
      ),
      total: parseInt(
        document
          .getElementById("summaryTotal")
          .textContent.replace(/[^0-9]/g, ""),
      ),
      orderDate: new Date().toLocaleString(),
    };

    // Save order to localStorage
    let orders = JSON.parse(localStorage.getItem("orders")) || [];
    orders.push(orderDetails);
    localStorage.setItem("orders", JSON.stringify(orders));

    // Show success message
    const totalAmount = document.getElementById("summaryTotal").textContent;
    showNotification(`Order placed successfully! Total: ${totalAmount}`);

    // Show order confirmation
    setTimeout(() => {
      alert(
        `Thank you for your order!\n\nOrder Details:\nName: ${name}\nAddress: ${address}\nContact: ${contact}\nTotal: ${totalAmount}\n\nYour order will be delivered soon.`,
      );

      // Clear cart and close modal
      cart = [];
      saveCart();
      checkoutForm.reset();
      checkoutModal.classList.remove("active");
      cartModal.classList.remove("active");
      renderCart();
    }, 500);
  });
}

// Close checkout modal when clicking outside
if (checkoutModal) {
  checkoutModal.addEventListener("click", (e) => {
    if (e.target === checkoutModal) {
      checkoutModal.classList.remove("active");
      cartModal.classList.add("active");
    }
  });
}

// Close cart when clicking outside the modal
if (cartModal) {
  cartModal.addEventListener("click", (e) => {
    if (e.target === cartModal) {
      cartModal.classList.remove("active");
    }
  });
}

// Initialize cart count on page load
updateCartCount();

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
