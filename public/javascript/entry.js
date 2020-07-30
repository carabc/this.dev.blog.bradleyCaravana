const navContainer = document.querySelector(".nav-container");
const navMenu = document.querySelector(".nav");
const closeBtn = navMenu.querySelector(".close-btn");
const menuBtn = document.querySelector(".header-btn");

closeBtn.addEventListener("click", () => {
  navContainer.classList.remove("open");
});

menuBtn.addEventListener("click", () => {
  navContainer.classList.add("open");
});

navContainer.addEventListener("click", (e) => {
  if (e.currentTarget === e.target) {
    navContainer.classList.remove("open");
  }
});

// Wire up the button to toggle dark mode when clicked with some JavaScript
const darkButton = document.querySelector(".dark-toggle");
let darkMode = localStorage.getItem("darkMode");

// darkButton.addEventListener("click", (e) => {
//   // When the button is clicked, toggle the class of 'dark' on the body's classList
//   document.body.classList.toggle("dark");
// });

const enableDarkMode = () => {
  document.body.classList.add("dark");
  localStorage.setItem("darkMode", "enabled");
};

const disableDarkMode = () => {
  document.body.classList.remove("dark");
  localStorage.setItem("darkMode", "null");
};

if (darkMode === "enabled") {
  enableDarkMode();
}

darkButton.addEventListener("click", () => {
  darkMode = localStorage.getItem("darkMode");
  if (darkMode !== "enabled") {
    enableDarkMode();
  } else {
    disableDarkMode();
  }
});
