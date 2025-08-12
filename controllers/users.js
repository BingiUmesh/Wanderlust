const User = require("../models/user.js");

module.exports.renderSignupForm = (req, res) => {
  res.render("users/signUp.ejs");
};

module.exports.signup = async (req, res) => {
  try {
    let { email, username, password } = req.body.user;
    let newUser = new User({
      email: email,
      username: username,
    });
    let registereduser = await User.register(newUser, password);
    req.login(registereduser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to Wanderlust!");
      res.redirect("/listings");
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/signup");
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
  req.flash("success", "Welcome back!");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Logged Out!");
    res.redirect("/listings");
  });
};
