export class DarkMode {
  constructor(btn) {
    this.darkBtn = btn;
    this.darkMode = localStorage.getItem("darkMode");
    this.attachEventListener();
    this.isDarkModeEnabled();
  }

  isDarkModeEnabled() {
    if (this.darkMode === "enabled") this.enableDarkMode();
  }

  enableDarkMode() {
    document.body.classList.add("dark");
    localStorage.setItem("darkMode", "enabled");
  }

  disableDarkMode() {
    document.body.classList.remove("dark");
    localStorage.setItem("darkMode", "null");
  }

  attachEventListener() {
    this.darkBtn.addEventListener("click", () => {
      this.darkMode = localStorage.getItem("darkMode");
      if (this.darkMode !== "enabled") {
        this.enableDarkMode();
      } else {
        this.disableDarkMode();
      }
    });
  }
}
