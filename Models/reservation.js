const mongoose = require("mongoose");

let reservationModel = mongoose.Schema({
    CustomerName: String,
    CarModel: String,
    ReservationDate: String,
});

module.exports = mongoose.model("reservation", reservationModel)