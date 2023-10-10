const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  dateTime: { type: Date, required: true },
  durationInHours: { type: Number, required: true }, 
  status: { type: String, enum: ["Pending", "Booked", "Cancel"], default: "Pending" },
  paymentStatus: { type: String, enum: ["Pending", "Paid", "Cancel"], default: "Pending" },
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
