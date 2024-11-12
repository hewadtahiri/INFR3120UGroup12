const express = require("express");
const router = express.Router();

// let mongoose = require('mongoose');
let reservations = [];
// let Reservation = require('../Models/reservation');

router.get("/", (req, res) => {
  res.render("Layout", { title: "Home", body: "Home", reservations });
});

/*Code for Edit operation
router.get('/edit/:id',async(req,res,next)=>{
  try{
      const id = req.params.id;
      const reservationToEdit = await Reservation.findById(id);
      res.render('Reservation/edit',
          {
              title: 'Edit Reservation',
              Reservation:reservationToEdit
          }
      )
  }
  catch(err)
  {
      console.error(err);
      next(err); // passing the error
  }
});

router.post('/edit/:id',async(req,res,next)=>{
  try{
      let id= req.params.id;
      let updatedReservation = Reservation({
          "_id":id,
          "CustomerName:":req.body.CustomerName,
          "CarModel:":req.body.CarModel,
          "ReservationDate:":req.body.ReservationDate

      })
      Reservation.findByIdAndUpdate(id, updatedReservation).then(()=>{
          res.redirect('/')
      })
  }
  catch(err)
  {
      console.error(err);
      res.render('Reservation/list',{
          error: 'Error on the server'
      })
  }
});*/

/*Code for Delete operation
router.get('/delete/:id',async(req,res,next)=>{
  try{
      let id=req.params.id;
      Reservation.deleteOne({_id:id}).then(()=>{
          res.redirect('/')
      })
  }
  catch(err)
  {
      console.error(err);
      res.render('Reservation/list',{
          error: 'Error on the server'
      })
  }
});*/

module.exports = router;