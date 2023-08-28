const loginsec = document.querySelector(".login-section");
const loginlink = document.querySelector(".login-link");
const registerlink = document.querySelector(".register-link");
const signUp = document.querySelector("#sign-up");
const login = document.querySelector("#login");
const loginEmailInput = document.querySelector("#login-email-input");
const loginPasswordInput = document.querySelector("#login-password-input");
const emailInput = document.querySelector("#email-input");
const usernameInput = document.querySelector("#username-input");
const passwordInput = document.querySelector("#password-input");
const contactInput = document.querySelector("#contact-input");
const carNumberInput = document.querySelector("#carNumber-input");

console.log(signUp);

registerlink.addEventListener("click", () => {
  loginsec.classList.add("active");
});
loginlink.addEventListener("click", () => {
  loginsec.classList.remove("active");
});

signUp.addEventListener("click", () => {
  registrationLink();
});

login.addEventListener("click", () => {
  loginLink();
  emailInput.value = "";
  passwordInput.value = "";
});

async function registrationLink() {
  const userData = {
    username: usernameInput.value,
    email: emailInput.value,
    password: passwordInput.value,
    contact: contactInput.value,
    carNumber: carNumberInput.value,
  };
  const response = await fetch(
    "https://final-project-backend-2gdn.onrender.com/new-user-registration",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    }
  );
  const result = await response.json();
}

async function loginLink() {
  const userLoginData = {
    email: loginEmailInput.value,
    password: loginPasswordInput.value,
  };
  const response = await fetch(
    "https://final-project-backend-2gdn.onrender.com/login",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userLoginData),
    }
  );

  const result = await response.json();

  if (response.ok) {
    // Successful login, redirect to indexx.html
    window.location.href = "indexx.html";
  } else {
    // Handle login failure
    console.error("Login failed:", result);
  }
}
