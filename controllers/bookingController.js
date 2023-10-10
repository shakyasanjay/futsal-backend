const Booking = require("../models/Booking");

// Create a new booking
const createBooking = async (req, res) => {
  try {
    const { dateTime, durationInHours } = req.body;
    const userId = req.user.userId; // Assuming you have user information in req.user

    // Calculate end time based on start time and duration
    const startTime = new Date(dateTime);
    const endTime = new Date(startTime);
    endTime.setHours(endTime.getHours() + durationInHours);

    // Check if there are any existing bookings that overlap with the new booking
    const existingBooking = await Booking.findOne({
      $or: [
        {
          // Existing booking starts within the new booking's duration
          dateTime: { $gte: startTime, $lt: endTime },
          status: { $in: ["Pending", "Booked"] }, // Consider both available and booked slots
        },
        {
          // Existing booking ends within the new booking's duration
          endTime: { $gt: startTime, $lte: endTime },
          status: { $in: ["Pending", "Booked"] }, // Consider both available and booked slots
        },
        {
          // Existing booking completely overlaps the new booking
          dateTime: { $lte: startTime },
          endTime: { $gte: endTime },
          status: { $in: ["Pending", "Booked"] }, // Consider both available and booked slots
        },
      ],
    });

    if (existingBooking) {
      return res.status(400).json({ message: "Time slot is not available" });
    }

    const booking = new Booking({
      user: userId,
      dateTime: startTime,
      durationInHours,
    });

    await booking.save();
    res.status(201).json({ message: "Booking created successfully", booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const checkBookingStatus = async (req, res) => {
  try {
    const bookingId = req.params.bookingId;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({ status: booking.status, paymentStatus: booking.paymentStatus });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all bookings
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("user");
    res.status(200).json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update booking status (admin action)
const updateBookingStatus = async (req, res) => {
  try {
    const bookingId = req.params.bookingId;
    const { status } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = status;
    await booking.save();

    res.status(200).json({ message: "Booking status updated successfully", booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updatePaymentStatus = async (req, res) => {
  try {
    const bookingId = req.params.bookingId;
    const { paymentStatus } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.paymentStatus = paymentStatus;
    await booking.save();

    res.status(200).json({ message: "Payment status updated successfully", booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getUserBookings = async (req, res) => {
  try {
    const userId = req.user.userId;
    const userBookings = await Booking.find({ user: userId });

    res.status(200).json(userBookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const bookingId = req.params.bookingId;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = "Cancel";
    booking.paymentStatus = "Cancel"

    console.log(booking)
    await booking.save();

    res.status(200).json({ message: "Booking canceled successfully", booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createBooking, checkBookingStatus, getAllBookings, updateBookingStatus, updatePaymentStatus, getUserBookings, cancelBooking
}