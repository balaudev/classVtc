const db = require("../models");
const Passport = require("passport");

//Express Validator
const { check, validationResult } = require("express-validator/check");
const { sanitize } = require("express-validator/filter");

exports.homePageGet = (req, res) => {
  res.render("index", { title: "Appelez ou Créer un compte pour reserver" });
};

exports.registerGet = (req, res) => {
  res.render("register", { title: "Je crée mon compte pour reserver" });
};

exports.registerPost = [
  // Validate Data
  check("first_name")
    .isLength({ min: 1 })
    .withMessage("vous devez spécifier votre nom")
    .isAlphanumeric()
    .withMessage("Un seul nom à la fois"),

  check("surname")
    .isLength({ min: 1 })
    .withMessage("vous devez spécifier votre prénom")
    .isAlphanumeric()
    .withMessage("Un seul nom à la fois"),

  check("email")
    .isEmail()
    .withMessage("Email Invalid  "),

  check("confirm_email")
    .custom((value, { req }) => value === req.body.email)
    .withMessage("L'addresse mail  ne correspond pas"),

  check("password")
    .isLength({ min: 6 })
    .withMessage("Mot de passe Invalid , doit contenir  6 characters minimum "),

  check("confirm_password")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Mot de passe ne correspond pas"),

  sanitize("*")
    .trim()
    .escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors

      // res.json(req.body);
      res.render("register", {
        title: "Il y a eu des erreurs lors de l'enregistrement: ",
        errors: errors.array()
      });
      return;
    } else {
      //No are errors
      const newUser = new db.userModel();
      newUser.local.first_name = req.body.first_name;
      newUser.local.surname = req.body.surname;
      newUser.local.email = req.body.email;
      newUser.local.password = req.body.password;

      db.userModel.register(newUser.local, req.body.password, function(err) {
        if (err) {
          console.log("error while registering!", err);
          return next(err);
        }
        next(); //move on to loginGet after registering
      });
    }
  }
];

exports.loginGet = (req, res) => {
  res.render("login", { title: " Continuez pour se connecter" });
};

exports.loginPost = Passport.authenticate("local", {
  successRedirect: "/user",
  successFlash: "Vous êtes connecté(e)",
  failureRedirect: "/login",
  failureFlash: "La connexion a échoué, Recommencez"
});

exports.loginGetTwitter = Passport.authenticate("twitter");

exports.logTwitterCallback = Passport.authenticate("twitter", {
  successRedirect: "/user",
  successFlash: "Vous êtes connecté(e)",
  failureRedirect: "/register"
});

exports.loginGetGoogle = Passport.authenticate("google", {
  scope: ["profile", "email"]
});

exports.logGoogleCallback = Passport.authenticate("google", {
  successRedirect: "/user",
  successFlash: "Vous êtes connecté(e)",
  failureRedirect: "/register"
});

exports.logout = (req, res) => {
  req.logout();
  req.flash("info", "Vous êtes déconnecté(e)");
  res.redirect("/");
};

exports.isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.isAdmin) {
    next();
    return;
  }
  res.redirect("/");
};
