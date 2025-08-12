const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");

router.get("/signup", (req, res) => {
  res.render("users/signUp.ejs");
});

module.exports = router;
