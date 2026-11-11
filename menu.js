let cart = getCart();
let currentFilter = "all";

const menuGrid = document.getElementById("menuGrid");
const filters = document.getElementById("filters");
const cartBtn = document.getElementById("cartBtn");
const cartClose = document.getElementById("cartClose");
const cartOverlay = document.getElementById("cartOverlay");
const cartDrawer = document.getElementById("cartDrawer");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const checkoutBtn = document.getElementById("checkoutBtn");
const toast = document.getElementById("toast");
const orderModal = document.getElementById("orderModal");
const orderModalOverlay = document.getElementById("orderModalOverlay");
const orderModalDetails = document.getElementById("orderModalDetails");
const closeOrderModal = document.getElementById("closeOrderModal");

function formatPrice(n) {
  if (n >= 70) return n + "/-";
  return "$" + Number(n).toFixed(2);
}

function renderMenu() {
  const filtered =
    currentFilter === "all"
      ? menuItems
      : menuItems.filter((item) => item.category === currentFilter);

  menuGrid.innerHTML = filtered
    .map(
      (item) => `
    <article class="menu-card">
      <div class="menu-card-img-wrap">
        ${item.chef ? '<span class="chef-badge">★ Chef Recommended</span>' : ""}
        <img src="${item.image}" alt="${item.name}" loading="lazy" />
      </div>
      <div class="menu-card-body">
        <div class="menu-card-top">
          <h3>${item.name}</h3>
          <span class="menu-price">${formatPrice(item.price)}</span>
        </div>
        <p class="menu-desc">${item.desc}</p>
        <div class="menu-card-footer">
          <span class="menu-tag">${item.category}</span>
          <button class="btn-add" data-id="${item.id}">Add to cart</button>
        </div>
      </div>
    </article>
  `
    )
    .join("");

  menuGrid.querySelectorAll(".btn-add").forEach((btn) => {
    btn.addEventListener("click", () => addToCart(Number(btn.dataset.id)));
  });
}

filters.addEventListener("click", (e) => {
  const btn = e.target.closest(".filter-btn");
  if (!btn) return;
  filters.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  currentFilter = btn.dataset.category;
  renderMenu();
});

function addToCart(id) {
  const item = menuItems.find((i) => i.id === id);
  if (!item) return;
  const existing = cart.find((c) => c.id === id);
  if (existing) existing.qty += 1;
  else cart.push({ id: item.id, name: item.name, price: item.price, image: item.image, qty: 1 });
  setCart(cart);
  updateCartUI();
  showToast(item.name + " added");
}

function changeQty(id, delta) {
  const item = cart.find((c) => c.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter((c) => c.id !== id);
  setCart(cart);
  updateCartUI();
}

function updateCartUI() {
  cart = getCart();
  const totalQty = cart.reduce((sum, i) => sum + i.qty, 0);
  const totalPrice = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  if (cartCount) cartCount.textContent = totalQty;
  if (cartTotal) cartTotal.textContent = "$" + totalPrice.toFixed(2);
  if (checkoutBtn) checkoutBtn.disabled = totalQty === 0;

  if (!cartItems) return;

  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="cart-empty">Your cart is empty</p>';
    return;
  }

  cartItems.innerHTML = cart
    .map(
      (item) => `
    <div class="cart-item">
      <div class="cart-item-thumb">
        <img src="${item.image}" alt="${item.name}" />
      </div>
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <p>$${(item.price * item.qty).toFixed(2)}</p>
      </div>
      <div class="cart-item-qty">
        <button class="qty-btn" data-action="minus" data-id="${item.id}">−</button>
        <span>${item.qty}</span>
        <button class="qty-btn" data-action="plus" data-id="${item.id}">+</button>
      </div>
    </div>
  `
    )
    .join("");

  cartItems.querySelectorAll(".qty-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      changeQty(Number(btn.dataset.id), btn.dataset.action === "plus" ? 1 : -1);
    });
  });
}

function openCart() {
  cartDrawer.classList.add("open");
  cartOverlay.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeCart() {
  cartDrawer.classList.remove("open");
  cartOverlay.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

if (cartBtn) cartBtn.addEventListener("click", openCart);
if (cartClose) cartClose.addEventListener("click", closeCart);
if (cartOverlay) cartOverlay.addEventListener("click", closeCart);

if (checkoutBtn) {
  checkoutBtn.addEventListener("click", () => {
    cart = getCart();
    if (cart.length === 0) return;

    const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
    const order = {
      id: generateOrderId(),
      date: new Date().toISOString(),
      items: cart.map((i) => ({
        id: i.id,
        name: i.name,
        price: i.price,
        qty: i.qty,
        image: i.image,
      })),
      total,
      status: "Confirmed",
    };

    saveOrder(order);
    cart = [];
    setCart(cart);
    updateCartUI();
    closeCart();
    showOrderConfirmation(order);
  });
}

function showOrderConfirmation(order) {
  const dateStr = new Date(order.date).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
  const itemsSummary = order.items.map((i) => i.qty + "× " + i.name).join(", ");

  orderModalDetails.innerHTML = `
    <p><strong>Order ID:</strong> ${order.id}</p>
    <p><strong>Date:</strong> ${dateStr}</p>
    <p><strong>Items:</strong> ${itemsSummary}</p>
    <p class="modal-total"><strong>Total:</strong> $${order.total.toFixed(2)}</p>
  `;

  orderModal.classList.add("open");
  orderModalOverlay.classList.add("open");
  orderModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function hideOrderModal() {
  orderModal.classList.remove("open");
  orderModalOverlay.classList.remove("open");
  orderModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

if (closeOrderModal) closeOrderModal.addEventListener("click", hideOrderModal);
if (orderModalOverlay) orderModalOverlay.addEventListener("click", hideOrderModal);

let toastTimer;
function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

renderMenu();
updateCartUI();
