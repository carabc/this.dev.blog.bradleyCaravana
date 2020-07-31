export class SlideNav {
  constructor({ navContainer, navMenu, closeBtn, menuBtn }) {
    this.navContainer = navContainer;
    this.navMenu = navMenu;
    this.closeBtn = closeBtn;
    this.menuBtn = menuBtn;
    this.listenForClickOnMenuBtn();
    this.listenForClickOnCloseBtn();
    this.listenForClickOutside();
  }

  listenForClickOnMenuBtn() {
    this.menuBtn.addEventListener("click", () => {
      this.navContainer.classList.add("open");
    });
  }

  listenForClickOnCloseBtn() {
    this.closeBtn.addEventListener("click", () => {
      this.navContainer.classList.remove("open");
    });
  }

  listenForClickOutside() {
    this.navContainer.addEventListener("click", (e) => {
      if (e.currentTarget === e.target) {
        this.navContainer.classList.remove("open");
      }
    });
  }
}
