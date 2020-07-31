import { SlideNav } from "./slideInNav.js";
import { DarkMode } from "./darkMode.js";

const options = {
  navContainer: document.querySelector(".nav-container"),
  navMenu: document.querySelector(".nav"),
  closeBtn: document.querySelector(".close-btn"),
  menuBtn: document.querySelector(".header-btn"),
};

const nav = new SlideNav(options);
const dm = new DarkMode(document.querySelector(".dark-toggle"));
