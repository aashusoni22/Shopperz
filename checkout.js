document.addEventListener("DOMContentLoaded", () => {
  const cartSummary = document.getElementById("cart-summary");
  const cartTotal = document.getElementById("cart-total");

  let cartItems = loadCartFromLocalStorage();

  function loadCartFromLocalStorage() {
    const users = JSON.parse(localStorage.getItem("userInfo")) || [];
    const loggedInUserEmail = localStorage.getItem("loggedInUserEmail");
    const loggedInUser = users.find((user) => user.email === loggedInUserEmail);

    return loggedInUser ? loggedInUser.cartItems || [] : [];
  }

  function renderCheckoutItems() {
    if (cartItems.length === 0) {
      cartSummary.innerHTML = "<p>Your cart is empty</p>";
      cartTotal.textContent = "$0.00";
      return;
    }

    const itemsHTML = cartItems
      .map(
        (item) => `
        <div class="checkout-item">
        <img src="${item.image}" alt="${item.title}">
        <div class="details">
          <h6>${
            item.title.length > 16
              ? item.title.slice(0, 16) + "..."
              : item.title
          }</h6>
          <span>Qty: <input type="number" name="qty" id="qty-${
            item.id
          }" value="${item.quantity}" min="1" class="form-control"></span>
          <p class="checkout-price">$${(item.price * item.quantity).toFixed(
            2
          )}</p>
        </div>
        <button class="btn btn-danger" data-id="${item.id}">Remove</button>
      </div>
    `
      )
      .join("");

    cartSummary.innerHTML = itemsHTML;

    const totalPrice = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    cartTotal.textContent = `$${totalPrice.toFixed(2)}`;

    document.querySelectorAll(".btn-danger").forEach((button) => {
      button.addEventListener("click", (e) => {
        const productId = e.currentTarget.getAttribute("data-id");
        removeItemFromCart(productId);
      });
    });

    document.querySelectorAll("[id^=qty-]").forEach((input) => {
      input.addEventListener("change", (e) => {
        const productId = e.currentTarget.id.split("-")[1];
        const newQuantity = parseInt(e.currentTarget.value, 10);
        updateItemQuantity(productId, newQuantity);
      });
    });
  }

  function removeItemFromCart(productId) {
    cartItems = cartItems.filter((item) => item.id != productId);
    saveCartToLocalStorage();
    renderCheckoutItems();
  }

  function updateItemQuantity(productId, newQuantity) {
    const item = cartItems.find((item) => item.id == productId);
    if (item) {
      item.quantity = newQuantity;
      saveCartToLocalStorage();
      renderCheckoutItems();
    }
  }

  function saveCartToLocalStorage() {
    const users = JSON.parse(localStorage.getItem("userInfo")) || [];
    const loggedInUserEmail = localStorage.getItem("loggedInUserEmail");
    const loggedInUser = users.find((user) => user.email === loggedInUserEmail);

    if (loggedInUser) {
      loggedInUser.cartItems = cartItems;
      localStorage.setItem("userInfo", JSON.stringify(users));
    }
  }

  renderCheckoutItems();
});
