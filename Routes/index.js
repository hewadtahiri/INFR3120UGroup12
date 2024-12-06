const express = require("express");
const passport = require("passport");
const router = express.Router();
const Credentials = require("../Models/Credentials");

// Simulates the database using an array.
let reservations = [];

// Verifies user authentication before granting access to the requested page.
function authVerification(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect("/login");
  }
  next();
}

// Displays home page and active reservations.
router.get("/", (req, res) => {
  res.render("Layout", { title: "Home", body: "Home", reservations, editReservation: null, user: req.user });
});

// Creates a new reservation.
router.post("/reservations", authVerification, (req, res) => {
  const newReservation = {
    id: Date.now(),
    customer_name: req.body.customer_name,
    car_model: req.body.car_model,
    reservation_date: req.body.reservation_date,
    userId: req.user._id,
  };
  reservations.push(newReservation);
  res.redirect("/#reservations");
});

// Edits an existing reservation.
router.get("/reservations/edit/:id", authVerification, (req, res) => {
  const reservationId = req.params.id;
  const reservation = reservations.find(r => r.id == reservationId);

  if (reservation) {
    res.render("Layout", {
      title: "Home",
      body: "Home",
      reservations,
      editReservation: reservation,
      user: req.user,
    });
  } else {
    res.redirect("/#reservations");
  }
});

// Updates an existing reservation.
router.post("/reservations/edit/:id", authVerification, (req, res) => {
  const reservation = reservations.find(r => r.id == req.params.id);
  if (reservation) {
    reservation.customer_name = req.body.customer_name;
    reservation.car_model = req.body.car_model;
    reservation.reservation_date = req.body.reservation_date;
  }
  res.redirect("/#reservations");
});

// Deletes an existing reservation.
router.get("/reservations/delete/:id", authVerification, (req, res) => {
  const reservationId = req.params.id;

  const reservation = reservations.find(r => r.id == reservationId);

  if (!reservation) {
    req.flash("error", "Reservation not found.");
    return res.redirect("/#reservations");
  }

  if (reservation.userId !== req.user._id) {
    req.flash("error", "You are not authorized to delete this reservation.");
    return res.redirect("/#reservations");
  }

  reservations = reservations.filter(r => r.id != reservationId);
  res.redirect("/#reservations");
});

// Displays the login page if the user is not authenticated, otherwise redirects to the homepage.
router.get("/login", (req, res, next) => {
  if (!req.user) {
    res.render("Authentication/Login", {
      title: "Login",
      body: "Login",
      displayName: req.user ? req.user.displayName : "",
      reservations,
      editReservation: null,
      user: req.user,
    });
  } else {
    return res.redirect("/");
  }
});

// Handles user login authentication, redirects to the reservations section on success, or back to the login page on failure.
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      req.flash("AuthenticationError");
      return res.redirect("/login");
    }

    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.redirect("/#reservations");
    });
  })(req, res, next);
});

// Displays the registration page if the user is not authenticated, otherwise redirects to the homepage.
router.get("/register", (req, res) => {
  if (!req.user) {
    res.render("Authentication/Register", {
      title: "Register",
      body: "Register",
      displayName: req.user ? req.user.displayName : "",
      reservations,
      editReservation: null,
      user: req.user,
    });
  } else {
    return res.redirect("/");
  }
});

// Handles user registration, validates input fields, and registers the user. Redirects to reservations page on success, or displays error messages on failure.
router.post("/register", (req, res) => {
  if (!req.body.username || !req.body.email || !req.body.displayName || !req.body.password) {
    return res.render("Authentication/Register", {
      title: "Register",
      body: "Register",
      displayName: req.user ? req.user.displayName : "",
      reservations,
      editReservation: null,
      user: req.user,
      errorMessage: "All fields are required.",
    });
  }

  let registeredUser = new Credentials({
    username: req.body.username,
    email: req.body.email,
    displayName: req.body.displayName,
  });

  Credentials.register(registeredUser, req.body.password, (err) => {
    if (err) {
      console.error("Registration Error:", err);

      if (err.name === "ExistingUserError") {
        req.flash("registerMessage", "Registration Error: User Already Exists.");
      }

      return res.render("Authentication/Register", {
        title: "Register",
        body: "Register",
        displayName: req.user ? req.user.displayName : "",
        reservations,
        editReservation: null,
        user: req.user,
        errorMessage: err.message,
      });
    }

    return passport.authenticate("local")(req, res, () => {
      res.redirect("/#reservations");
    });
  });
});

// Logs out the user and redirects to the homepage.
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      console.error("Logout Error:", err);
      return next(err);
    }
    res.redirect("/");
  });
});

module.exports = router;