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

darkButton.addEventListener("click", (e) => {
  // When the button is clicked, toggle the class of 'dark' on the body's classList
  document.body.classList.toggle("dark");
});
