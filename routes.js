const express = require("express");
const router = express.Router();
const userController = require("./controllers/userController");
const bookingController = require("./controllers/bookingController");
const authenticateUser = require("./middleware/authentication");

const isAdmin = (req, res, next) => {
  if (req.user.role === "ADMIN") {
    next();
  } else {
    res.status(403).json({ message: "Access denied" });
  }
};

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/profile", authenticateUser, userController.getMyProfile);
router.put("/profile", authenticateUser, userController.updateMyProfile);

router.post("/booking/create", authenticateUser, bookingController.createBooking);
router.get("/booking/:bookingId/status", bookingController.checkBookingStatus);
router.get("/booking", authenticateUser,  bookingController.getAllBookings);
router.put("/booking/:bookingId/booking-status", authenticateUser, bookingController.updateBookingStatus);
router.put("/booking/:bookingId/payment-status", authenticateUser, bookingController.updatePaymentStatus);
router.get("/booking/my-bookings", authenticateUser, bookingController.getUserBookings);
router.delete("/booking/:bookingId", authenticateUser, bookingController.cancelBooking);

// router.get(
  //   "/admin/bookings",
  //   authenticateUser,
  //   bookingController.getAllBookings
  // );
  // router.post("/booking", authenticateUser, bookingController.createBooking);
  // router.get("/bookings", authenticateUser, bookingController.getBookingsForUser);
  // router.put(
    //   "/booking/:bookingId",
    //   authenticateUser,
    //   //   isAdmin,
    //   bookingController.updateBooking
// );
// router.delete(
  //   "/booking/:bookingId",
  //   authenticateUser,
  //   //   isAdmin,
  //   bookingController.deleteBooking
  // );

module.exports = router;