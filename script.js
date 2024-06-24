document.addEventListener("DOMContentLoaded", () => {
  const productsContainer = document.querySelector(".row");
  const loginBtn = document.querySelector(".loginBtn");
  const signupBtn = document.querySelector(".signupBtn");
  const loginPop = document.querySelector("#loginPop");
  const loginPopClose = document.querySelector(".loginPop-close");
  const signUpPop = document.querySelector("#signUpPop");
  const signUpPopClose = document.querySelector(".signUpPop-close");
  const createaccountLink = document.querySelector(".createaccount-link");
  const loginLink = document.querySelector(".login-link");
  const loginEmail = document.querySelector("#login-email");
  const loginPwd = document.querySelector("#login-pwd");
  const rememberMe = document.querySelector("#rememberMe");
  const loginPopBtn = document.querySelector(".loginPopBtn");
  const signUpUsername = document.querySelector("#signUp-username");
  const signUpEmail = document.querySelector("#signUp-email");
  const signUpPwd = document.querySelector("#signUp-pwd");
  const signUpRegister = document.querySelector(".signUp-register");
  const termscondition = document.querySelector("#t-c");
  const toast = document.querySelector(".toast");
  const loggedInProfile = document.querySelector("#logged-in-profile");
  const logoutProfile = document.querySelector(".fa-right-from-bracket");
  const loggedUsername = document.querySelector("#logged-username");
  const pwdStrength = document.querySelector(".pwdStrength");
  const pwdBar = document.getElementById("pwdBar");
  const pwderror = document.getElementById("password-error");
  const showPwd = document.querySelector(".showPwdIcon");
  const shoppingCartMenu = document.querySelector(".shoppingCartMenu");
  const shoppingCart = document.querySelector(".shoppingCart");
  const userNotFound = document.getElementById("userNotFound");
  const passwordIncorrect = document.getElementById("passwordIncorrect");
  const cartClose = document.querySelector(".cart-close");
  const cartSection = document.querySelector(".cartSection");
  const mainContent = document.querySelector("#mainContent");
  const cartCount = document.querySelector(".cart-count");
  const scrollToTopBtn = document.getElementById("scrollToTopBtn");

  let cartItems = [];
  let logoutTimer;
  let modalTimeout;

  document.body.classList.add("js-enabled");

  //Scroll to top
  window.addEventListener("scroll", () => {
    if (window.scrollY > 200) {
      scrollToTopBtn.style.display = "flex";
    } else {
      scrollToTopBtn.style.display = "none";
    }
  });

  scrollToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  //Close hamburger when the user click anywhere in window
  window.addEventListener("click", () => {
    document.querySelector(".navbar-collapse").classList.remove("show");
  });

  //Extend session modal
  const sessionModal = new bootstrap.Modal(
    document.getElementById("sessionModal")
  );

  document.addEventListener("DOMContentLoaded", () => {
    resetLogoutTimer();

    document.addEventListener("mousemove", resetLogoutTimer);
    document.addEventListener("keypress", resetLogoutTimer);
  });

  function resetLogoutTimer() {
    clearTimeout(logoutTimer);
    clearTimeout(modalTimeout);

    const rememberMe = localStorage.getItem("rememberMe") === "true";
    const loggedIn = loggedInProfile.style.display === "flex";

    if (rememberMe && loggedIn) {
      // If "Remember Me" is checked, allow 1 hour without activity
      logoutTimer = setTimeout(showSessionModal, 1440 * 60 * 1000); // 1 day
    } else if (loggedIn) {
      // If "Remember Me" is not checked, allow 30 minutes without activity
      logoutTimer = setTimeout(showSessionModal, 30 * 60 * 1000); // 30 minutes
    }
  }

  function showSessionModal() {
    sessionModal.show();

    modalTimeout = setTimeout(() => {
      sessionModal.hide();
      logout();
    }, 10000); // Hide modal and logout after 10 minutes if no action is taken

    document
      .getElementById("extendSessionButton")
      .addEventListener("click", extendSession);
    document.getElementById("logoutModal").addEventListener("click", logout);

    window.addEventListener("click", extendSession);
  }

  function extendSession() {
    clearTimeout(modalTimeout);
    sessionModal.hide();
    resetLogoutTimer();
  }

  function logout() {
    clearTimeout(logoutTimer);
    clearTimeout(modalTimeout);

    // Clear user session data
    loginBtn.style.display = "block";
    signupBtn.style.display = "block";
    loggedInProfile.style.display = "none";
    shoppingCartMenu.style.display = "none";
    shoppingCart.style.display = "none";
    cartCount.style.display = "none";
    cartItems = [];

    // Show logout success toast
    toast.innerHTML = `<div class="toast-header bg-danger text-white">
        <strong class="me-auto"><i class="bi-gift-fill"></i> You are logged out!</strong>
    </div>`;
    toast.style.display = "block";
    setTimeout(() => {
      toast.style.display = "none";
    }, 2000);

    localStorage.setItem("rememberMe", "false");
    localStorage.removeItem("loggedInUserEmail");
    localStorage.removeItem("newuser", true);
  }

  window.addEventListener("load", () => {
    resetLogoutTimer();

    const signUpLoad = localStorage.getItem("newuser") === true;
    const loggedInUserEmail = localStorage.getItem("loggedInUserEmail");

    if (isUserLoggedIn()) {
      loggedInProfile.style.display = "flex";
      loggedUsername.textContent = loggedInUserEmail;
      loginBtn.style.display = "none";
      signupBtn.style.display = "none";
      shoppingCartMenu.style.display = "flex";
      cartCount.style.display = "block";
      loadCartFromLocalStorage();
    } else if (signUpLoad) {
      loggedInProfile.style.display = "flex";
      loggedUsername.textContent = loggedInUserEmail;
      loginBtn.style.display = "none";
      signupBtn.style.display = "none";
      shoppingCartMenu.style.display = "flex";
      cartCount.style.display = "block";
    } else {
      loginBtn.style.display = "block";
      signupBtn.style.display = "block";
    }
  });

  //Fetching products
  async function fetchProducts() {
    fetch("https://fakestoreapi.com/products")
      .then((response) => response.json())
      .then((data) => {
        productsContainer.innerHTML = data
          .map((product) => {
            // Generate the star rating HTML
            const fullStars = Math.floor(product.rating.rate);
            const halfStar = product.rating.rate % 1 >= 0.5 ? 1 : 0;
            const emptyStars = 5 - fullStars - halfStar;

            const starRatingHTML = `
            ${`(${product.rating.count})`}
                  ${'<i class="fa fa-star"></i> '.repeat(fullStars)}
                  ${halfStar ? '<i class="fa fa-star-half-alt"></i>' : ""}
                `;

            return `
                <div class="card" style="width: 17rem">
                  <span>
                    <img src="${product.image}" class="card-img-top" alt="${
              product.title
            }" />
                  </span>
                  <div class="card-body">
                    <h5 class="card-title" style="font-size: 1rem; height: 40px;">
                      ${
                        product.title.length > 40
                          ? product.title.slice(0, 40) + "..."
                          : product.title
                      }
                    </h5>
                    
                    <span class="rating-price">
                      <p class="card-text">$${product.price}</p>
                      <p class="card-text rating">${starRatingHTML}</p>
                    </span>
                    <div class="productButtons">
                      <a href="#" class="btn btn-primary itemCartBtn" data-id="${
                        product.id
                      }">
                        <i class="fa-solid fa-cart-plus"></i>
                      </a>
                    </div>
                  </div>
                </div>
                `;
          })
          .join("");

        document.querySelectorAll(".itemCartBtn").forEach((button) => {
          button.addEventListener("click", (event) => {
            event.preventDefault();

            if (
              loginBtn.style.display !== "none" &&
              signupBtn.style.display !== "none"
            ) {
              loginPop.style.display = "block";
              mainContent.style.opacity = "40%";
              document
                .querySelectorAll(".itemCartBtn")
                .forEach((btn) => (btn.disabled = true));
            } else {
              const productId = event.currentTarget.getAttribute("data-id");
              // Change the clicked button to indicate success
              button.classList.remove("btn-primary");
              button.classList.add("btn-success");
              button.innerHTML = `Added <i class="fa-solid fa-check"></i>`;
              if (
                button.innerHTML === `<i class="fa-solid fa-cart-plus"></i>`
              ) {
                button.disabled = true;
              } else {
                button.disabled = false;
              }
              // Optionally revert the button back after a delay
              setTimeout(() => {
                button.classList.remove("btn-success");
                button.classList.add("btn-primary");
                button.innerHTML = `<i class="fa-solid fa-cart-plus"></i>`;
              }, 3000); // Adjust the delay as needed
              addItemToCart(productId);
            }
          });
        });
      });
  }

  //Add to cart
  function addItemToCart(productId) {
    fetch(`https://fakestoreapi.com/products/${productId}`)
      .then((response) => response.json())
      .then((product) => {
        const existingItem = cartItems.find((item) => item.id === product.id);

        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          cartItems.push({
            ...product,
            quantity: 1,
          });
        }
        updateCartUI();
        saveCartToLocalStorage();
      });
  }

  //Update cart UI
  function updateCartUI() {
    const totalPrice = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    cartSection.innerHTML = `
        <p class="cartCount">${
          cartItems.length === 0
            ? "Your cart is empty"
            : `${cartItems.length} Items`
        } </p>
        <div class="cartContent">
        ${cartItems
          .map(
            (item) => `
            <div class="cartItem">
                <img src="${item.image}" alt="${item.title}" />
                <div>
                    <h6>${
                      item.title.length > 16
                        ? item.title.split(" ").join(" ").slice(0, 16) + ".."
                        : item.title
                    }</h6>
                    <span>
                        <p class="cartQty">Qty:</p>
                        <input type="number" name="qty" id="qty-${
                          item.id
                        }" value="${item.quantity}" min="1" />
                    </span>
                </div>
                <p class="cartPrice">$${(item.price * item.quantity).toFixed(
                  2
                )}</p>
                <i class="fa-solid fa-trash" style="color: crimson" data-id="${
                  item.id
                }"></i>
            </div>
                <hr />
                `
          )
          .join("")}
        </div>
        <div class="cartFooter">
            <h6 class="totalPrice">Total: <span>$${totalPrice.toFixed(
              2
            )}</span></h6>
            <a href= ${isUserLoggedIn ? "checkout.html" : "index.html"}><button
            } class="btn btn-primary checkoutBtn">Checkout</button></a>
        </div>
    `;

    if (cartItems.length === 0) {
      document.querySelector(".checkoutBtn").disabled = true;
    } else {
      document.querySelector(".checkoutBtn").disabled = false;
    }
    cartCount.innerText = cartItems.length;
    document.querySelectorAll(".fa-trash").forEach((button) => {
      button.addEventListener("click", (e) => {
        const productId = e.currentTarget.getAttribute("data-id");
        removeItemFromCart(productId);
      });
    });
    document.querySelectorAll("[id^=qty-]").forEach((input) => {
      input.addEventListener("change", (event) => {
        const productId = event.currentTarget.id.split("-")[1];
        const newQuantity = parseInt(event.currentTarget.value, 10);
        updateItemQuantity(productId, newQuantity);
      });
    });
    saveCartToLocalStorage(); // Save cart state after UI update
  }

  //Close cart
  cartClose.addEventListener("click", () => {
    shoppingCart.classList.remove("visible");
  });

  //Delete item from cart
  function removeItemFromCart(productId) {
    cartItems = cartItems.filter((item) => item.id != productId);
    updateCartUI();
    saveCartToLocalStorage();
  }

  //Update cart item quantity
  function updateItemQuantity(productId, newQuantity) {
    const item = cartItems.find((item) => item.id === productId);
    if (item) {
      item.quantity = newQuantity;
    }
    updateCartUI();
    saveCartToLocalStorage();
  }

  //Save details to localstorage
  function saveCartToLocalStorage() {
    const users = JSON.parse(localStorage.getItem("userInfo")) || [];
    const loggedInUser = users.find(
      (user) => user.email === loggedUsername.textContent
    );

    if (loggedInUser) {
      loggedInUser.cartItems = cartItems;
      localStorage.setItem("userInfo", JSON.stringify(users));
    }
  }

  //Fetch from localstorage
  function loadCartFromLocalStorage() {
    const users = JSON.parse(localStorage.getItem("userInfo")) || [];
    const loggedInUser = users.find(
      (user) => user.email === loggedUsername.textContent
    );

    if (loggedInUser) {
      cartItems = loggedInUser.cartItems || []; // Load the cart items from localStorage
      updateCartUI(); // Update the cart display
    }
  }

  //Check if the user is login in order to show the localstorage items
  document.addEventListener("DOMContentLoaded", () => {
    if (isUserLoggedIn()) {
      loadCartFromLocalStorage();
    }

    fetchProducts();
  });

  //Is user login?
  function isUserLoggedIn() {
    return localStorage.getItem("loggedInUserEmail") !== null;
  }

  //Login Btn Navbar
  loginBtn.addEventListener("click", (e) => {
    e.preventDefault();
    loginPop.style.display = "block";
    mainContent.style.opacity = "30%";
    loginEmail.focus();
    if (signUpPop.style.display == "block") {
      signUpPop.style.display = "none";
    }
  });

  //Signup Btn Navbar
  signupBtn.addEventListener("click", (e) => {
    e.preventDefault();
    signUpPop.style.display = "block";
    mainContent.style.opacity = "30%";
    signUpUsername.focus();
    if (loginPop.style.display == "block") {
      loginPop.style.display = "none";
    }
  });

  //Create account link in login pop up
  createaccountLink.addEventListener("click", () => {
    signUpPop.style.display = "block";
    if (loginPop.style.display == "block") {
      loginPop.style.display = "none";
    }
    loginEmail.classList.remove("my-shake");
    loginPwd.classList.remove("my-shake");
    signUpEmail.value = "";
    signUpUsername.value = "";
    signUpPwd.value = "";
    termscondition.checked = false;
    pwdStrength.style.display = "none";
    signUpPop.style.height = "28rem";
    document.querySelector("#emailError").innerText = "";
    showPwd.style.top = "232px";
    if (pwdStrength.style.display === "none") {
      signUpPop.style.height = "28rem";
    }
  });

  //Login link in sign up pop up
  loginLink.addEventListener("click", () => {
    loginPop.style.display = "block";
    document.querySelector(".alreadyHaveAcc").innerText =
      "Already have an account?";
    document.querySelector(".alreadyHaveAcc").style.color = "";
    if (signUpPop.style.display == "block") {
      signUpPop.style.display = "none";
    }
    signUpEmail.classList.remove("my-shake");
    signUpUsername.classList.remove("my-shake");
    signUpPwd.classList.remove("my-shake");
    termscondition.classList.remove("my-shake");
  });

  //Login pop up close button
  loginPopClose.addEventListener("click", () => {
    loginPop.style.display = "none";
    signUpPop.style.display = "none";
    mainContent.style.opacity = "";
    loginEmail.classList.remove("my-shake");
    loginPwd.classList.remove("my-shake");
    userNotFound.innerText = "";
    passwordIncorrect.innerText = "";
    clearInput();
  });

  //SIgn up pop up close up
  signUpPopClose.addEventListener("click", () => {
    signUpPop.style.display = "none";
    mainContent.style.opacity = "";
    signUpEmail.classList.remove("my-shake");
    signUpUsername.classList.remove("my-shake");
    signUpPwd.classList.remove("my-shake");
    termscondition.classList.remove("my-shake");
    document.querySelector("#emailError").innerText = "";
    showPwd.style.top = "232px";
    signUpUsername.value = "";
    signUpEmail.value = "";
    signUpPwd.value = "";
    termscondition.checked = false;
    signUpPop.style.height = "";
    pwdStrength.style.display = "none";
  });

  //Validate email
  let validEmail =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+\.(com|net|org|edu|gov|mil|biz|info|mobi|name|aero|jobs|museum)$/;

  //Login btn in login pop up window to login
  loginPopBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const email = loginEmail.value.trim();
    const password = loginPwd.value;
    if (
      validEmail.test(email) &&
      password.length >= 8 &&
      !/\s/.test(password)
    ) {
      const user = checkUserInfo(email, password);

      if (user) {
        if (rememberMe.checked) {
          localStorage.setItem("rememberMe", "true");
          localStorage.setItem("loggedInUserEmail", email);
        } else {
          localStorage.setItem("rememberMe", "false");
        }

        toast.innerHTML = `<div class="toast-header bg-success text-white">
        <strong class="me-auto">
          <i class="bi-gift-fill"></i> ${user.username} logged In Successfully!
        </strong>
      </div>`;
        toast.style.display = "block";
        setTimeout(() => {
          toast.style.display = "none";
        }, 2000);
        loginPop.style.display = "none";
        mainContent.style.opacity = "";
        loginBtn.style.display = "none";
        signupBtn.style.display = "none";
        loggedInProfile.style.display = "flex";
        shoppingCartMenu.style.display = "block";
        loginEmail.value = "";
        loginPwd.value = "";
        rememberMe.checked = false;
        cartCount.style.display = "block";
        loggedUsername.textContent = user.email;
        cartItems = user.cartItems || [];
        resetLogoutTimer(); // Start the logout timer
        updateCartUI();
      } else if (checkPassword(email, password)) {
        passwordIncorrect.innerText = "Password incorrect";
        loginPop.style.height = "25.5rem";
      }
      if (!checkEmail(loginEmail)) {
        userNotFound.innerText = "User not found";
        loginPop.style.height = "25.5rem";
      }
    } else {
      if (!validEmail.test(email)) {
        loginEmail.classList.add("my-shake");
      }
      if (password.length < 8 || /\s/.test(password)) {
        loginPwd.classList.add("my-shake");
      }
      passwordIncorrect.innerText = "";
      userNotFound.innerText = "";
    }
  });

  //Logout btn in navbar
  logoutProfile.addEventListener("click", () => {
    logout();
  });

  //Sign up btn in signup pop window
  signUpRegister.addEventListener("click", (e) => {
    e.preventDefault();

    // Clear previous errors
    clearErrors();

    let valid = true;
    showPwd.style.top = "233px";
    signUpPop.style.height = "28rem";
    if (signUpUsername.value.trim() === "") {
      displayError(signUpUsername, "Username is required");
      valid = false;
    }

    if (signUpPwd.value.trim() === "") {
      displayError(signUpPwd, "Password is required");
      valid = false;
    } else if (signUpPwd.value.trim().length < 8) {
      displayError(signUpPwd, "Password must be at least 8 characters");
      valid = false;
    } else if (/\s/.test(signUpPwd.value)) {
      displayError(signUpPwd, "Password cannot contain spaces");
      valid = false;
    }

    if (signUpEmail.value.trim() === "") {
      displayError(signUpEmail, "Email is required");
      valid = false;
    } else if (!validEmail.test(signUpEmail.value)) {
      displayError(signUpEmail, "Email is invalid");
      valid = false;
    }

    if (!termscondition.checked) {
      displayError(
        termscondition,
        "You must agree to the terms and conditions"
      );
      valid = false;
    }
    if (valid) {
      if (
        saveUserDetails(
          signUpUsername.value,
          signUpEmail.value,
          signUpPwd.value
        )
      ) {
        localStorage.setItem("newuser", true);
        localStorage.setItem("loggedInUserEmail", signUpEmail.value);
        updateCartUI();
        toast.innerHTML = `<div class="toast-header bg-success text-white">
      <strong class="me-auto"><i class="bi-gift-fill"></i> Account Created Successfully!</strong>
      </div>`;
        toast.style.display = "block";
        setTimeout(() => {
          toast.style.display = "none";
        }, 2000);
        signUpPop.style.display = "none";
        mainContent.style.opacity = "";
        pwdStrength.style.display = "none";
        loginBtn.style.display = "none";
        signupBtn.style.display = "none";
        loggedUsername.innerText = signUpEmail.value;
        loggedInProfile.style.display = "flex";
        signUpUsername.value = "";
        signUpEmail.value = "";
        signUpPwd.value = "";
        termscondition.checked = false;
        shoppingCartMenu.style.display = "block";
        signUpPop.style.height = "28rem";
        cartCount.style.display = "block";
        resetLogoutTimer();
        localStorage.setItem("rememberMe", "false");
      }
      if (alreadyHaveAccount(signUpEmail.value)) {
        document.querySelector("#emailError").innerText =
          "You Already have an account";
        showPwd.style.top = "252px";
        signUpUsername.value = "";
        signUpPwd.value = "";
        termscondition.checked = false;
        signUpPop.style.height = "30rem";
        loginEmail.value = signUpEmail.value;
      } else {
        signUpPop.style.height = "28.rem";
      }

      if (
        (document.querySelector("#emailError").innerText =
          "You Already have an account")
      ) {
        showPwd.style.top = "252px";
      } else {
        signUpUsername.value = "";
        signUpPwd.value = "";
        signUpEmail.value = "";
        termscondition.checked = false;
        signUpPop.style.height = "28rem";
        document.querySelector("#emailError").innerText = "";
      }
    }
    pwdBar.style.display = "none";
  });

  //Show password icon
  showPwd.addEventListener("click", () => {
    if (signUpPwd.type === "password") {
      signUpPwd.type = "text";
      showPwd.classList.remove("fa-eye");
      showPwd.classList.add("fa-eye-slash");
    } else {
      signUpPwd.type = "password";
      showPwd.classList.add("fa-eye");
      showPwd.classList.remove("fa-eye-slash");
    }
  });

  //Shopping Cart icon in navbar
  shoppingCartMenu.addEventListener("click", (event) => {
    event.stopPropagation();
    shoppingCart.classList.toggle("visible");
    document.querySelector(".navbar-collapse").classList.remove("show");
  });

  // Check if the click is outside the cart and the toggle button
  document.addEventListener("click", (event) => {
    if (
      !shoppingCart.contains(event.target) &&
      !shoppingCartMenu.contains(event.target)
    ) {
      shoppingCart.classList.remove("visible");
    }
  });

  //Shopping cart sidebar
  shoppingCart.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  //Show errors
  function displayError(element, message) {
    const errorElement = document.getElementById(`${element.id}Error`);
    if (errorElement) {
      errorElement.innerText = message;
    }
    element.classList.add("my-shake");
  }

  //Clear error
  function clearErrors() {
    document.querySelectorAll(".error").forEach((errorElement) => {
      errorElement.innerText = "";
    });
    document.querySelectorAll(".my-shake").forEach((element) => {
      element.classList.remove("my-shake");
    });
  }

  //CLear error on input
  function clearErrorOnInput() {
    loginEmail.addEventListener("input", () => {
      loginPop.style.height = "24.5";
      userNotFound.innerText = "";
      loginEmail.classList.remove("my-shake");
    });
    loginPwd.addEventListener("input", () => {
      loginPwd.classList.remove("my-shake");
      passwordIncorrect.innerText = "";
      loginPop.style.height = "24.5";
    });
    if (rememberMe.checked === true) {
      document.querySelector(".remember-checkbox").style.color = "";
    }

    signUpUsername.addEventListener("input", () => {
      signUpUsername.classList.remove("my-shake");
    });

    signUpEmail.addEventListener("input", () => {
      signUpEmail.classList.remove("my-shake");
      showPwd.style.top = "232px";
      if (
        pwdStrength.style.display === "none" &&
        document.querySelector("#emailError").innerText === ""
      ) {
        signUpPop.style.height = "28rem";
      }
      document.querySelector("#emailError").innerText = "";
    });
    termscondition.addEventListener("click", () => {
      termscondition.classList.remove("my-shake");
    });

    //Password strength
    signUpPwd.addEventListener("input", () => {
      signUpPop.style.height = "30rem";
      pwdStrength.style.display = "flex";
      const strength = getPasswordStrength(signUpPwd.value);
      if (signUpPwd.value.trim() !== "") {
        pwdBar.style.display = "block";
        pwderror.innerText = strength;
        if (pwderror.innerText === "Moderate") {
          pwderror.style.color = "#f0ad4e";
          pwdBar.style.width = "75%";
          pwdBar.style.backgroundColor = "#f0ad4e";
        } else if (pwderror.innerText === "Strong") {
          pwderror.style.color = "#5cb85c";
          pwdBar.style.width = "100%";
          pwdBar.style.backgroundColor = "#5cb85c";
        } else {
          pwderror.style.color = "#d9534f";
          pwdBar.style.width = "50%";
          pwdBar.style.backgroundColor = "#d9534f";
        }
      } else if (signUpPwd.value.trim() === "") {
        pwdStrength.style.display = "none";
        signUpPop.style.height = "28rem";
      }
    });
  }

  //Clear input when user login or sign up or close the pop up window
  function clearInput() {
    loginPopClose.addEventListener("click", () => {
      loginEmail.value = "";
      loginPwd.value = "";
      rememberMe.checked = false;
      loginPop.style.height = "";
    });
  }

  //Password strength
  function getPasswordStrength(password) {
    let strength = "Weak";
    if (password.length >= 8) {
      strength = "Moderate";
    }
    if (
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /\d/.test(password) &&
      /[@$!%*?&#]/.test(password)
    ) {
      strength = "Strong";
    }
    return strength;
  }

  //Save sign up details to storage
  function saveUserDetails(username, email, password) {
    const encryptedPassword = encryptPassword(password);
    const userInfo = {
      username: username,
      email: email,
      password: encryptedPassword,
      cartItems: [],
    };
    let users = JSON.parse(localStorage.getItem("userInfo")) || [];
    const userExists = users.some((user) => user.email === email);
    if (!userExists) {
      users.push(userInfo);
      localStorage.setItem("userInfo", JSON.stringify(users));
      return true;
    } else {
      return false;
    }
  }

  //Check if account already exists
  function alreadyHaveAccount(email) {
    const users = JSON.parse(localStorage.getItem("userInfo")) || [];
    const user = users.find((user) => user.email === email);
    if (user) {
      return true;
    } else {
      return false;
    }
  }

  //Check if the password is incorrect for the existing user
  function checkPassword(email, password) {
    const users = JSON.parse(localStorage.getItem("userInfo")) || [];
    const user = users.find((user) => user.email === email);

    if (user && decryptPassword(user.password) !== password) {
      return true;
    }
    return false;
  }

  //Check if user exists
  function checkEmail(email) {
    const users = JSON.parse(localStorage.getItem("userInfo")) || [];
    const user = users.find((user) => user.email !== email);

    if (user) {
      return true;
    } else {
      return false;
    }
  }

  //LOGIN: Check if the email & password from localstorage
  function checkUserInfo(email, password) {
    const users = JSON.parse(localStorage.getItem("userInfo")) || [];
    const user = users.find(
      (user) =>
        user.email === email && decryptPassword(user.password) === password
    );
    return user || null;
  }

  //Password Encryption
  function encryptPassword(password) {
    return CryptoJS.AES.encrypt(password, "your-secret-key").toString();
  }

  //Password Decryption
  function decryptPassword(encryptedPassword) {
    const bytes = CryptoJS.AES.decrypt(encryptedPassword, "your-secret-key");
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  loadCartFromLocalStorage();
  updateCartUI();
  fetchProducts();
  clearErrorOnInput();
  clearInput();
});
