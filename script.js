// Background carousel functionality
document.addEventListener("DOMContentLoaded", function () {
  const slides = document.querySelectorAll(".background-slide");
  let currentSlide = 0;

  function showNextSlide() {
    slides[currentSlide].classList.remove("active");
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add("active");
  }
  setInterval(showNextSlide, 3000);
});

// Cart data
let cart = {};
const phoneNumber = "628999537861";

// DOM Elements
const cartBtn = document.getElementById("openCart");
const cartSidebar = document.getElementById("cartSidebar");
const cartOverlay = document.getElementById("cartOverlay");
const closeCartBtn = document.getElementById("closeCart");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartCount = document.getElementById("cartCount");
const checkoutBtn = document.getElementById("checkoutBtn");

// Add to cart buttons
const addToCartButtons = document.querySelectorAll(".cart-btn");

// Add to cart functionality
addToCartButtons.forEach((button) => {
  button.addEventListener("click", function () {
    const name = this.getAttribute("data-name");
    const price = parseInt(this.getAttribute("data-price"));
    const id = this.getAttribute("data-id");
    const image = this.getAttribute("data-image");

    if (!cart[id]) {
      cart[id] = { name, price, quantity: 0, image };
    }
    cart[id].quantity++;

    updateCart();
    showAddedToCart();
  });
});

// Update cart display
function updateCart() {
  // Update badges
  Object.keys(cart).forEach((id) => {
    const badge = document.getElementById(`badge-${id}`);
    if (badge) {
      badge.textContent = cart[id].quantity;
      badge.style.display = cart[id].quantity > 0 ? "flex" : "none";
    }
  });

  // Update cart count
  const totalCount = Object.values(cart).reduce(
    (total, item) => total + item.quantity,
    0
  );
  cartCount.textContent = totalCount;

  // Update sidebar content
  if (totalCount === 0) {
    cartItems.innerHTML =
      '<p class="text-center text-muted">Keranjang Anda masih kosong</p>';
    cartTotal.textContent = "Total: Rp 0";
  } else {
    let cartHTML = "";
    let total = 0;

    Object.entries(cart).forEach(([id, item]) => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;

      cartHTML += `
                        <div class="cart-item" data-id="${id}">
                            <img src="${item.image}" alt="${
        item.name
      }" class="cart-item-image">
                            <div class="cart-item-info">
                                <div class="cart-item-name">${item.name}</div>
                                <div class="cart-item-price">Rp ${item.price.toLocaleString(
                                  "id-ID"
                                )}</div>
                            </div>
                            <div class="cart-item-quantity">
                                <button class="quantity-btn minus" data-id="${id}">-</button>
                                <span class="quantity-value">${
                                  item.quantity
                                }</span>
                                <button class="quantity-btn plus" data-id="${id}">+</button>
                            </div>
                        </div>
                    `;
    });

    cartItems.innerHTML = cartHTML;
    cartTotal.textContent = `Total: Rp ${total.toLocaleString("id-ID")}`;

    // Add event listeners for quantity buttons
    document.querySelectorAll(".quantity-btn.minus").forEach((btn) => {
      btn.addEventListener("click", function () {
        const id = this.getAttribute("data-id");
        if (cart[id].quantity > 1) {
          cart[id].quantity--;
        } else {
          delete cart[id];
        }
        updateCart();
      });
    });

    document.querySelectorAll(".quantity-btn.plus").forEach((btn) => {
      btn.addEventListener("click", function () {
        const id = this.getAttribute("data-id");
        cart[id].quantity++;
        updateCart();
      });
    });
  }
}

// Show cart sidebar
cartBtn.addEventListener("click", function () {
  cartSidebar.classList.add("active");
  cartOverlay.classList.add("active");
});

// Close cart sidebar
closeCartBtn.addEventListener("click", function () {
  cartSidebar.classList.remove("active");
  cartOverlay.classList.remove("active");
});

cartOverlay.addEventListener("click", function () {
  cartSidebar.classList.remove("active");
  cartOverlay.classList.remove("active");
});

// Checkout functionality
checkoutBtn.addEventListener("click", function () {
  if (Object.keys(cart).length === 0) {
    alert("Keranjang Anda masih kosong!");
    return;
  }

  let message = "Halo Warung Mpok Titin! Saya ingin memesan:\n\n";
  let total = 0;

  Object.values(cart).forEach((item) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    message += `- ${item.name} x${
      item.quantity
    } = Rp ${itemTotal.toLocaleString("id-ID")}\n`;
  });

  message += `\nTotal yang harus dibayar: Rp ${total.toLocaleString(
    "id-ID"
  )}\n\n`;
  message += "Terima kasih! :)";

  // Encode the message for WhatsApp
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  window.open(whatsappUrl, "_blank");
});

// Show "Added to cart" feedback
function showAddedToCart() {
  // Create temporary feedback element
  const feedback = document.createElement("div");
  feedback.textContent = "✓ Ditambahkan ke keranjang!";
  feedback.style.cssText = `
                position: fixed;
                bottom: 80px;
                right: 20px;
                background: #28a745;
                color: white;
                padding: 12px 20px;
                border-radius: 8px;
                z-index: 1001;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                animation: slideIn 0.3s ease, fadeOut 0.5s ease 2s forwards;
            `;

  document.body.appendChild(feedback);

  // Remove after animation
  setTimeout(() => {
    feedback.remove();
  }, 2500);
}

// Add CSS for feedback animation
const style = document.createElement("style");
style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
        `;
document.head.appendChild(style);

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth",
    });
  });
});
