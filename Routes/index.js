const express = require("express");
const router = express.Router();

let reservations = [];
// let mongoose = require("mongoose");
// let reservation = require("../Models/reservation");

router.get("/", (req, res) => {
  res.render("Layout", { title: "Home", body: "Home", reservations });
});

/* Code for Edit operation
router.get("/edit/:id",async(req,res,next)=>{
  try{
      const id = req.params.id;
      const reservationToEdit = await Resereservationrvation.findById(id);
      res.render("reservation/edit",
          {
              title: "Edit Reservation",
              reservation:reservationToEdit
          }
      )
  }
  catch(err)
  {
      console.error(err);
      next(err); // passing the error
  }
});

router.post("/edit/:id",async(req,res,next)=>{
  try{
      let id= req.params.id;
      let updatedReservation = reservation({
          "_id":id,
          "CustomerName:":req.body.CustomerName,
          "CarModel:":req.body.CarModel,
          "ReservationDate:":req.body.ReservationDate

      })
      reservation.findByIdAndUpdate(id, updatedReservation).then(()=>{
          res.redirect("/")
      })
  }
  catch(err)
  {
      console.error(err);
      res.render("reservation/list",{
          error: "Error on the server."
      })
  }
}); */

/* Code for Delete operation
router.get("/delete/:id",async(req,res,next)=>{
  try{
      let id=req.params.id;
      reservation.deleteOne({_id:id}).then(()=>{
          res.redirect("/")
      })
  }
  catch(err)
  {
      console.error(err);
      res.render("reservation/list",{
          error: "Error on the server."
      })
  }
}); */

module.exports = router;