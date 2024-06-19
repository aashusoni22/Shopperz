document.addEventListener("DOMContentLoaded", () => {
  const productsContainer = document.querySelector(".row");
  const loginBtn = document.querySelector(".loginBtn");
  const signupBtn = document.querySelector(".signupBtn");
  const loginPop = document.querySelector("#loginPop");
  const loginPopClose = document.querySelector(".loginPop-close");
  const signUpPop = document.querySelector("#signUpPop");
  const signUpPopClose = document.querySelector(".signUpPop-close");
  const products = document.querySelector("#products");
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
  const navbarHeight = document.querySelector(".navbar").offsetHeight;
  const userNotFound = document.getElementById("userNotFound");
  const passwordIncorrect = document.getElementById("passwordIncorrect");
  const cartClose = document.querySelector(".cart-close");
  const cartSection = document.querySelector(".cartSection");
  const mainContent = document.querySelector("#mainContent");
  const cartCount = document.querySelector(".cart-count");
  let cartItems = [];

  // Function to check if the sign-up popup should be shown
  function shouldShowSignUp() {
    if (
      loginBtn.style.display !== "none" &&
      signupBtn.style.display !== "none"
    ) {
      // Retrieve the count of refreshes from localStorage
      let refreshCount = localStorage.getItem("refreshCount");

      // If refreshCount is not set or is less than 4, return false
      if (!refreshCount || refreshCount < 3) {
        return false;
      }

      // If refreshCount is 4 or 5, reset it to 0 and return true
      if (refreshCount >= 3 && refreshCount <= 4) {
        localStorage.setItem("refreshCount", 0); // Reset the count
        return true;
      }
    }
  }

  // Increment refresh count in localStorage
  function incrementRefreshCount() {
    let refreshCount = localStorage.getItem("refreshCount");
    refreshCount = refreshCount ? parseInt(refreshCount) + 1 : 1;
    localStorage.setItem("refreshCount", refreshCount);
  }

  // Check if it's time to show the sign-up popup
  if (shouldShowSignUp()) {
    signUpPop.style.display = "block";
    mainContent.style.opacity = "40%";
  }

  // Increment refresh count
  incrementRefreshCount();

  // // Function to set the session with expiration
  // function setSession(email, expirationMinutes) {
  //   const expirationTime = new Date().getTime() + expirationMinutes * 60 * 1000;
  //   sessionStorage.setItem("userEmail", email);
  //   sessionStorage.setItem("sessionExpiration", expirationTime);
  // }

  // // Function to check if the session is still valid
  // function isSessionValid() {
  //   const expirationTime = sessionStorage.getItem("sessionExpiration");
  //   return new Date().getTime() < expirationTime;
  // }

  // // Function to check if user is already logged in
  // function isUserLoggedIn() {
  //   const userEmail = sessionStorage.getItem("userEmail");
  //   const isValidSession = isSessionValid();
  //   return userEmail && isValidSession;
  // }

  // let inactivityTimer;

  // // Function to log out the user
  // function logoutUser() {
  //   loginBtn.style.display = "block";
  //   signupBtn.style.display = "block";
  //   loggedInProfile.style.display = "none";
  //   shoppingCartMenu.style.display = "none";
  //   cartCount.style.display = "none";

  //   sessionStorage.removeItem("userEmail");
  //   sessionStorage.removeItem("sessionExpiration");

  //   toast.innerHTML = `<div class="toast-header bg-danger text-white">
  //     <strong class="me-auto"><i class="bi-gift-fill"></i> You are logged out due to inactivity!</strong>
  //   </div>`;
  //   toast.style.display = "block";
  //   setTimeout(() => {
  //     toast.style.display = "none";
  //   }, 2000);

  //   cartItems = [];
  //   updateCartUI();
  // }

  // // Function to reset inactivity timer
  // function resetInactivityTimer() {
  //   clearTimeout(inactivityTimer);
  //   inactivityTimer = setTimeout(logoutUser, 0.6 * 1000); // 1 minute
  // }

  // // Initialize inactivity timer when the user logs in
  // if (loggedUsername.style.display !== "none") {
  //   document.addEventListener("mousemove", resetInactivityTimer);
  //   document.addEventListener("keydown", resetInactivityTimer);
  //   document.addEventListener("click", resetInactivityTimer);
  //   document.addEventListener("scroll", resetInactivityTimer);
  //   resetInactivityTimer();
  // }

  async function fetchProducts() {
    fetch("https://fakestoreapi.com/products")
      .then((response) => response.json())
      .then((data) => {
        productsContainer.innerHTML = data
          .map(
            (product) => `
            <div class="card" style="width: 17rem">
            <span>
              <img src= ${product.image} class="card-img-top" alt="${
              product.title
            }" />
            </span> 
            <div class="card-body">
              <h5 class="card-title" style="font-size: 1rem;">${
                product.title.length > 18
                  ? product.title.slice(0, 18) + "..."
                  : product.title
              }</h5>
              <p class="card-text">${
                product.description.length > 33
                  ? product.description.slice(0, 33) + "..."
                  : product.description
              }</p>
              <p class="card-text">$${product.price}</p>
              <div class="productButtons">
                <a href="#" class="btn btn-primary itemCartBtn" data-id="${
                  product.id
                }"><i class="fa-solid fa-cart-plus"></i></a>
              </div>
            </div>
          </div>
        `
          )
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
            <button class="btn btn-primary checkoutBtn">Checkout</button>
        </div>
    `;
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

  cartClose.addEventListener("click", () => {
    shoppingCart.classList.remove("visible");
  });

  function removeItemFromCart(productId) {
    cartItems = cartItems.filter((item) => item.id != productId);
    updateCartUI();
    saveCartToLocalStorage();
  }

  function updateItemQuantity(productId, newQuantity) {
    const item = cartItems.find((item) => item.id === productId);
    if (item) {
      item.quantity = newQuantity;
    }
    updateCartUI();
    saveCartToLocalStorage();
  }

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

  document.addEventListener("DOMContentLoaded", () => {
    if (isUserLoggedIn()) {
      loadCartFromLocalStorage();
    }

    fetchProducts();
  });

  function isUserLoggedIn() {
    return (
      loggedUsername.style.display !== "none"
      // (sessionStorage.getItem("userEmail") && isSessionValid())
    );
  }

  loginBtn.addEventListener("click", (e) => {
    e.preventDefault();
    loginPop.style.display = "block";
    mainContent.style.opacity = "30%";
    if (signUpPop.style.display == "block") {
      signUpPop.style.display = "none";
    }
  });

  signupBtn.addEventListener("click", (e) => {
    e.preventDefault();
    signUpPop.style.display = "block";
    mainContent.style.opacity = "30%";
    if (loginPop.style.display == "block") {
      loginPop.style.display = "none";
    }
  });

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

  let validEmail =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+\.(com|net|org|edu|gov|mil|biz|info|mobi|name|aero|jobs|museum)$/;

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
        // Set session expiration
        // const sessionExpiration = new Date().getTime() + 60 * 1000; // 15 minutes from now
        // localStorage.setItem("sessionExpiration", sessionExpiration);
        // localStorage.setItem("loggedInUser", JSON.stringify(user));

        if (rememberMe.checked) {
          localStorage.setItem("rememberMe", "true");
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
        updateCartUI();
      } else if (checkPassword(email, password)) {
        passwordIncorrect.innerText = "Password incorrect";
        loginPop.style.height = "25.5rem";
      } else if (checkEmail(loginEmail)) {
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

  logoutProfile.addEventListener("click", () => {
    loginBtn.style.display = "block";
    signupBtn.style.display = "block";
    loggedInProfile.style.display = "none";
    shoppingCartMenu.style.display = "none";
    cartCount.style.display = "none";

    // localStorage.removeItem("sessionExpiration");
    // localStorage.removeItem("loggedInUser");
    // localStorage.removeItem("rememberMe");

    // Show logout success toast
    toast.innerHTML = `<div class="toast-header bg-danger text-white">
    <strong class="me-auto"><i class="bi-gift-fill"></i> You are logged out!</strong>
  </div>`;
    toast.style.display = "block";
    setTimeout(() => {
      toast.style.display = "none";
    }, 2000);

    cartItems = [];
    // Update the UI if necessary
  });

  // function checkSession() {
  //   const sessionExpiration = localStorage.getItem("sessionExpiration");
  //   const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  //   const rememberMe = localStorage.getItem("rememberMe") === "true";

  //   if (sessionExpiration && new Date().getTime() < sessionExpiration) {
  //     if (loggedInUser) {
  //       loginBtn.style.display = "none";
  //       signupBtn.style.display = "none";
  //       loggedInProfile.style.display = "flex";
  //       shoppingCartMenu.style.display = "block";
  //       loggedUsername.textContent = loggedInUser.email;
  //       cartItems = loggedInUser.cartItems || [];
  //       updateCartUI();
  //     }
  //     // Extend session if remember me is checked
  //     if (rememberMe) {
  //       const newExpiration = new Date().getTime() + 15 * 60 * 1000;
  //       localStorage.setItem("sessionExpiration", newExpiration);
  //     }
  //   } else {
  //     // Clear session data if expired
  //     localStorage.removeItem("sessionExpiration");
  //     localStorage.removeItem("loggedInUser");
  //     localStorage.removeItem("rememberMe");
  //   }
  // }

  // checkSession();

  // function extendSessionExpiration() {
  //   const rememberMe = localStorage.getItem("rememberMe") === "true";
  //   if (rememberMe) {
  //     const newExpiration = new Date().getTime() + 15 * 60 * 1000;
  //     localStorage.setItem("sessionExpiration", newExpiration);
  //   }
  // }

  // // Call extendSessionExpiration() in relevant event listeners
  // document.addEventListener("click", extendSessionExpiration);

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

  shoppingCartMenu.addEventListener("click", (event) => {
    event.stopPropagation();
    shoppingCart.classList.toggle("visible");
  });

  document.addEventListener("click", (event) => {
    // Check if the click is outside the cart and the toggle button
    if (
      !shoppingCart.contains(event.target) &&
      !shoppingCartMenu.contains(event.target)
    ) {
      shoppingCart.classList.remove("visible");
    }
  });

  shoppingCart.addEventListener("click", (event) => {
    event.stopPropagation(); // Prevent the click event inside the cart from propagating to the document
  });

  function displayError(element, message) {
    const errorElement = document.getElementById(`${element.id}Error`);
    if (errorElement) {
      errorElement.innerText = message;
    }
    element.classList.add("my-shake");
  }

  function clearErrors() {
    document.querySelectorAll(".error").forEach((errorElement) => {
      errorElement.innerText = "";
    });
    document.querySelectorAll(".my-shake").forEach((element) => {
      element.classList.remove("my-shake");
    });
  }

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

  function clearInput() {
    loginPopClose.addEventListener("click", () => {
      loginEmail.value = "";
      loginPwd.value = "";
      rememberMe.checked = false;
      loginPop.style.height = "";
    });
  }

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

  // function updateCartPosition() {
  //   const scrollTop = window.scrollY || document.documentElement.scrollTop;
  //   if (scrollTop > navbarHeight) {
  //     shoppingCart.style.top = "0";
  //   } else {
  //     shoppingCart.style.top = `${navbarHeight - scrollTop}px`;
  //   }
  // }

  // Listen to the scroll event
  // window.addEventListener("scroll", updateCartPosition);

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

  function alreadyHaveAccount(email) {
    const users = JSON.parse(localStorage.getItem("userInfo")) || [];
    const user = users.find((user) => user.email === email);
    if (user) {
      return true;
    } else {
      return false;
    }
  }

  function checkPassword(email, password) {
    const users = JSON.parse(localStorage.getItem("userInfo")) || [];
    const user = users.find((user) => user.email === email);

    if (user && decryptPassword(user.password) !== password) {
      return true; // Password is incorrect
    }
    return false;
  }

  function checkEmail(email) {
    const users = JSON.parse(localStorage.getItem("userInfo")) || [];
    const user = users.find(
      (user) => user.email !== email || user.email === null
    );

    if (user) {
      return true;
    }
    return false;
  }

  function checkUserInfo(email, password) {
    const users = JSON.parse(localStorage.getItem("userInfo")) || [];
    const user = users.find(
      (user) =>
        user.email === email && decryptPassword(user.password) === password
    );
    return user || null;
  }

  function encryptPassword(password) {
    return CryptoJS.AES.encrypt(password, "your-secret-key").toString();
  }

  // Function to decrypt a password
  function decryptPassword(encryptedPassword) {
    const bytes = CryptoJS.AES.decrypt(encryptedPassword, "your-secret-key");
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  loadCartFromLocalStorage();
  updateCartUI();
  // updateCartPosition();
  fetchProducts();
  clearErrorOnInput();
  clearInput();
});
