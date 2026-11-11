function renderOrderHistory() {
  const ordersList = document.getElementById("ordersList");
  if (!ordersList) return;

  const orders = getOrders();

  if (orders.length === 0) {
    ordersList.innerHTML =
      '<p class="orders-empty">No orders yet. Place an order from the menu!</p>';
    return;
  }

  ordersList.innerHTML = orders
    .map((order) => {
      const dateStr = new Date(order.date).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      });

      const itemsHtml = order.items
        .map(
          (i) => `
        <div class="order-item-row">
          <span>${i.qty}× ${i.name}</span>
          <span>$${(i.price * i.qty).toFixed(2)}</span>
        </div>
      `
        )
        .join("");

      return `
      <article class="order-card">
        <div class="order-card-header">
          <span class="order-id">${order.id}</span>
          <span class="order-date">${dateStr}</span>
          <span class="order-status">${order.status}</span>
        </div>
        <div class="order-card-body">
          ${itemsHtml}
        </div>
        <div class="order-card-footer">
          <span>Total</span>
          <strong>$${order.total.toFixed(2)}</strong>
        </div>
      </article>
    `;
    })
    .join("");
}

renderOrderHistory();
