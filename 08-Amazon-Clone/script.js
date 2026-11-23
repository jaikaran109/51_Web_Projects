
const STORAGE_KEY = "amazonCloneWishlist";

// Category names and image paths
const categories = {
  "Clothes": "image/box1_image.jpg",
  "Health & Personal Care": "image/box2_image.jpg",
  "Furniture": "image/box3_image.jpg",
  "Electronics": "image/box4_image.jpg",
  "Beauty Picks": "image/box5_image.jpg",
  "Pet Care": "image/box6_image.jpg",
  "New Arrivals in Toys": "image/box7_image.jpg",
  "Discover Fashion Trends": "image/box8_image.jpg"
};

// Load wishlist from localStorage
function loadWishlist() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved)
      ? saved.filter(category => categories[category])
      : [];
  } catch (error) {
    return [];
  }
}

let wishlist = loadWishlist();

// Save wishlist
function saveWishlist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist));
  } catch (error) {
    console.error("Unable to save wishlist:", error);
  }
}

// Update wishlist count and buttons
function updateWishlistUI() {
  const count = document.getElementById("wishlist-count");
  const headingCount = document.getElementById("wishlist-heading-count");

  if (count) count.textContent = wishlist.length;
  if (headingCount) headingCount.textContent = `(${wishlist.length})`;

  document.querySelectorAll(".wishlist-btn").forEach(button => {
    const category = button.dataset.category;
    const isAdded = wishlist.includes(category);

    button.classList.toggle("active", isAdded);
    button.setAttribute("aria-pressed", String(isAdded));

    button.textContent = isAdded
      ? "♥ Added to Wishlist"
      : "♡ Add to Wishlist";
  });
}

// Display wishlist items
function renderWishlist() {
  const wishlistItems = document.getElementById("wishlist-items");
  const emptyMessage = document.getElementById("wishlist-empty");

  if (!wishlistItems || !emptyMessage) return;

  wishlistItems.innerHTML = "";

  emptyMessage.hidden = wishlist.length > 0;

  wishlist.forEach(category => {
    const item = document.createElement("article");
    item.className = "wishlist-item";

    const image = document.createElement("img");
    image.src = categories[category];
    image.alt = category;

    const heading = document.createElement("h3");
    heading.textContent = category;

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "remove-wishlist-btn";
    removeButton.dataset.removeCategory = category;
    removeButton.textContent = "Remove";

    item.appendChild(image);
    item.appendChild(heading);
    item.appendChild(removeButton);

    wishlistItems.appendChild(item);
  });
}

// Add or remove a category
function toggleWishlist(category) {
  if (!categories[category]) return;

  if (wishlist.includes(category)) {
    wishlist = wishlist.filter(item => item !== category);
  } else {
    wishlist.push(category);
  }

  saveWishlist();
  updateWishlistUI();
  renderWishlist();
}

// Open wishlist view
function openWishlist() {
  // Hide the category cards
  document.querySelectorAll(".product-card").forEach(card => {
    card.hidden = true;
  });

  // Hide the hero banner if it exists
  const hero = document.querySelector(".hero-section, .hero");
  if (hero) hero.hidden = true;

  // Show wishlist
  const wishlistSection = document.getElementById("wishlist-section");

  if (wishlistSection) {
    wishlistSection.hidden = false;
  } else {
    console.error("Wishlist section not found. Check its HTML id.");
    return;
  }

  renderWishlist();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Return to shopping
function closeWishlist() {
  // Show the category cards again
  document.querySelectorAll(".product-card").forEach(card => {
    card.hidden = false;
  });

  // Show the hero banner again
  const hero = document.querySelector(".hero-section, .hero");
  if (hero) hero.hidden = false;

  // Hide wishlist
  const wishlistSection = document.getElementById("wishlist-section");

  if (wishlistSection) {
    wishlistSection.hidden = true;
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Add-to-wishlist buttons
document.querySelectorAll(".wishlist-btn").forEach(button => {
  button.addEventListener("click", () => {
    toggleWishlist(button.dataset.category);
  });
});

// Navbar wishlist button
const wishlistToggle = document.getElementById("wishlist-toggle");

if (wishlistToggle) {
  wishlistToggle.addEventListener("click", openWishlist);
}

// Continue shopping button
const backButton = document.getElementById("back-to-shopping");

if (backButton) {
  backButton.addEventListener("click", closeWishlist);
}

// Remove button inside wishlist
const wishlistItems = document.getElementById("wishlist-items");

if (wishlistItems) {
  wishlistItems.addEventListener("click", event => {
    const button = event.target.closest("[data-remove-category]");

    if (button) {
      toggleWishlist(button.dataset.removeCategory);
    }
  });
}

// Initialize page
updateWishlistUI();
renderWishlist();
