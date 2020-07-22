const express = require("express");
const {
  register,
  registerPage,
  login,
  loginPage,
  getMe,
} = require("../controllers/auth");
const { protect } = require("../middleware/auth");
const router = express.Router();

router.get("/register", registerPage);
router.post("/register", register);
router.get("/login", loginPage);
router.post("/login", login);
router.get("/getMe", protect, getMe);

module.exports = router;
