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
