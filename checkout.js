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
            item.title.length > 35
              ? item.title.slice(0, 35) + "..."
              : item.title
          }</h6>
          <span>Qty: <input type="number" name="qty" id="qty-${
            item.id
          }" value="${item.quantity}" min="1" class="form-control"></span>
          </div>
          <p class="checkout-price" style="margin-bottom:0; margin-right: 11px;">$${(
            item.price * item.quantity
          ).toFixed(2)}</p>
       <i class="fa-solid fa-trash btn btn-danger" style="color: white; padding: 6px; font-size: 10px" data-id="${
         item.id
       }"></i>
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

  document.addEventListener("DOMContentLoaded", () => {
    function checkIfLoggedIn() {
      const loggedInUserEmail = localStorage.getItem("loggedInUserEmail");
      if (!loggedInUserEmail) {
        window.location.href = "index.html";
      }
    }
    checkIfLoggedIn();
  });

  // Function to generate a random tracking number
  function generateTrackingNumber() {
    return "TRK" + Math.floor(Math.random() * 1000000000);
  }

  // Handle the place order action
  document.querySelector(".place-order").addEventListener("click", (e) => {
    e.preventDefault();

    if (!document.getElementById("checkout-form").checkValidity()) {
      document.getElementById("checkout-form").reportValidity();
      return;
    }

    const trackingNumber = generateTrackingNumber();

    // Redirect to the thank you page with the tracking number as a query parameter
    window.location.href = `thankyou.html?trackingNumber=${trackingNumber}`;
  });

  renderCheckoutItems();
});
