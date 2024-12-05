const express = require("express");
const passport = require("passport");
const router = express.Router();
const Credentials = require("../Models/Credentials");
const Reservations = require("../Models/Reservations");

// Verifies user authentication before granting access to the requested page.
function authVerification(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect("/login");
  }
  next();
}

// Displays Home page and active reservations.
router.get("/", async (req, res) => {
  const reservation = await Reservations.find({ user_id: req.user._id }).exec();
  res.render("Layout", { 
    title: "Home", 
    body: "Home", 
    reservation, 
    editReservation: null, 
    user: req.user 
  });
});

// Creates a new reservation.
router.post("/reservations", authVerification, async (req, res) => {
  const newReservation = new Reservations({
    customer_name: req.body.customer_name,
    car_model: req.body.car_model,
    reservation_date: req.body.reservation_date,
    user_id: req.user._id,
  });

  await newReservation.save();
  res.redirect("/#reservations");
});

// Edits an existing reservation.
router.get("/reservations/edit/:id", authVerification, async (req, res) => {
  const reservationId = req.params.id;
  const reservation = await Reservations.findById(reservationId).exec();

  if (reservation) {
    res.render("Layout", {
      title: "Home",
      body: "Home",
      reservation: await Reservations.find({ user_id: req.user._id }).exec(),
      editReservation: reservation,
      user: req.user,
    });
  } else {
    res.redirect("/#reservations");
  }
});

// Updates an existing reservation.
router.post("/reservations/edit/:id", authVerification, async (req, res) => {
  const reservationId = req.params.id;
  const reservation = await Reservations.findById(reservationId).exec();

  if (reservation) {
    reservation.customer_name = req.body.customer_name;
    reservation.car_model = req.body.car_model;
    reservation.reservation_date = req.body.reservation_date;
    await reservation.save();
  }
  res.redirect("/#reservations");
});

// Deletes an existing reservation.
router.get("/reservations/delete/:id", authVerification, async (req, res) => {
  const reservationId = req.params.id;
  const reservation = await Reservations.findById(reservationId).exec();

  if (!reservation) {
    req.flash("error", "Reservation not found.");
    return res.redirect("/#reservations");
  }

  if (reservation.user_id.toString() !== req.user._id.toString()) {
    req.flash("error", "You are not authorized to delete this reservation.");
    return res.redirect("/#reservations");
  }

  await reservation.delete();
  res.redirect("/#reservations");
});

// Displays the login page if the user is not authenticated, otherwise redirects to the Home page.
router.get("/login", async (req, res) => {
  if (!req.user) {
    res.render("Authentication/Login", {
      title: "Login",
      body: "Login",
      displayName: req.user ? req.user.displayName : "",
      reservation: await Reservations.find({ user_id: req.user._id }).exec(),
      editReservation: null,
      user: req.user,
    });
  } else {
    return res.redirect("/");
  }
});

// Handles user login authentication, redirects to the reservations section on success, or back to the Login page on failure.
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

// Displays the registration page if the user is not authenticated, otherwise redirects to the Home page.
router.get("/register", async (req, res) => {
  if (!req.user) {
    res.render("Authentication/Register", {
      title: "Register",
      body: "Register",
      displayName: req.user ? req.user.displayName : "",
      reservation: await Reservations.find({ user_id: req.user._id }).exec(),
      editReservation: null,
      user: req.user,
    });
  } else {
    return res.redirect("/");
  }
});

// Handles user registration, validates input fields, and registers the user. Redirects to Reservations page on success, or displays error messages on failure.
router.post("/register", async (req, res) => {
  if (!req.body.username || !req.body.email || !req.body.displayName || !req.body.password) {
    return res.render("Authentication/Register", {
      title: "Register",
      body: "Register",
      displayName: req.user ? req.user.displayName : "",
      reservation: await Reservations.find({ user_id: req.user._id }).exec(),
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
        req.flash("registerMessage", "Registration Error: User already exists.");
      }

      return res.render("Authentication/Register", {
        title: "Register",
        body: "Register",
        displayName: req.user ? req.user.displayName : "",
        reservation: await Reservations.find({ user_id: req.user._id }).exec(),
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

// Logs out the user and redirects to the Home page.
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