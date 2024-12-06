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
  try {
    const reservations = req.user ? await Reservations.find({ userId: req.user._id }) : [];
    
    res.render("Layout", {
      title: "Home",
      body: "Home",
      reservations,
      editReservation: null,
      user: req.user || null,
    });
  } catch (error) {
    console.error("Error fetching reservations:", error);
    res.status(500).send("Error fetching reservations.");
  }
});

// Creates a new reservation.
router.post("/reservations", authVerification, async (req, res) => {
  try {
    const newReservation = new Reservations({
      customer_name: req.body.customer_name,
      car_model: req.body.car_model,
      reservation_date: req.body.reservation_date,
      userId: req.user._id,
    });
    await newReservation.save();
    res.redirect("/#reservations");
  } catch (error) {
    console.error("Error creating reservation:", error);
    res.status(500).send("Error creating reservation.");
  }
});

// Edits an existing reservation.
router.get("/reservations/edit/:id", authVerification, async (req, res) => {
  try {
    const reservation = await Reservations.findById(req.params.id);

    if (reservation && reservation.userId.toString() === req.user._id.toString()) {
      res.render("Layout", {
        title: "Home",
        body: "Home",
        reservations: await Reservations.find({ userId: req.user._id }),
        editReservation: reservation,
        user: req.user,
      });
    } else {
      res.redirect("/#reservations");
    }
  } catch (error) {
    console.error("Error fetching reservation:", error);
    res.status(500).send("Error fetching reservation.");
  }
});

// Updates an existing reservation.
router.post("/reservations/edit/:id", authVerification, async (req, res) => {
  try {
    const reservation = await Reservations.findById(req.params.id);
    
    if (reservation && reservation.userId.toString() === req.user._id.toString()) {
      if (!req.body.reservation_date) {
        return res.render("Layout", {
          title: "Home",
          body: "Home",
          reservations: await Reservations.find({ userId: req.user._id }),
          editReservation: reservation,
          user: req.user,
          errorMessage: "Reservation date is required.",
        });
      }

      reservation.customer_name = req.body.customer_name;
      reservation.car_model = req.body.car_model;
      reservation.reservation_date = req.body.reservation_date;

      await reservation.save();
      res.redirect("/#reservations");
    } else {
      res.redirect("/#reservations");
    }
  } catch (error) {
    console.error("Error updating reservation:", error);
    res.status(500).send("Error updating reservation.");
  }
});

// Deletes an existing reservation.
router.get("/reservations/delete/:id", authVerification, async (req, res) => {
  try {
    const reservation = await Reservations.findById(req.params.id);
    if (!reservation) {
      req.flash("error", "Reservation not found.");
      return res.redirect("/#reservations");
    }

    if (reservation.userId.toString() !== req.user._id.toString()) {
      req.flash("error", "You are not authorized to delete this reservation.");
      return res.redirect("/#reservations");
    }

    await Reservations.deleteOne({ _id: req.params.id });
    res.redirect("/#reservations");
  } catch (error) {
    console.error("Error deleting reservation:", error);
    res.status(500).send("Error deleting reservation.");
  }
});

// Displays the Login page if the user is not authenticated, otherwise redirects to the Home page.
router.get("/login", (req, res) => {
  if (!req.user) {
    res.render("Layout", {
      title: "Login",
      body: "Login",
      displayName: req.user ? req.user.displayName : "",
      reservations: [],
      editReservation: null,
      user: req.user,
    });
  } else {
    return res.redirect("/");
  }
});

// Handles user login authentication, redirects to the Reservations page on success, or back to the Login page on failure.
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
      return res.redirect("/");
    });
  })(req, res, next);
});

// Displays the Registration page if the user is not authenticated, otherwise redirects to the Home page.
router.get("/register", (req, res) => {
  if (!req.user) {
    res.render("Layout", {
      title: "Register",
      body: "Register",
      displayName: req.user ? req.user.displayName : "",
      reservations: [],
      editReservation: null,
      user: req.user,
    });
  } else {
    return res.redirect("/");
  }
});

// Handles user registration, validates input fields, and registers the user. Redirects to Reservations page on success, or displays error messages on failure.
router.post("/register", (req, res) => {
  if (!req.body.username || !req.body.email || !req.body.displayName || !req.body.password) {
    return res.render("Layout", {
      title: "Register",
      body: "Register",
      displayName: req.user ? req.user.displayName : "",
      reservations: [],
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
        reservations: [],
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