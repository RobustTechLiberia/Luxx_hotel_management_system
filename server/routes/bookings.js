/* eslint-disable no-undef */
const express = require("express");
const mysql = require("mysql2");

const router = express.Router();

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password@123",
  database: "hotels",
});

const formatDate = (dateValue) => {
  if (!dateValue) return null;

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return dateValue;

  return date.toISOString().slice(0, 10);
};

const normalizeHotelName = (hotelName) =>
  hotelName.toString().trim().toLowerCase().replace(/\s+/g, " ");

const hotelPayments = {
  "royal grand hotel": "$10",
  "boluvard hotel": "$25",
  "boluvard palace": "$25",
  "sinkor palace": "$5",
  "sinkor palace hotel": "$5",
  "bella cassa": "$5",
  "bella cassa hotel": "$5",
  "bella casa hotel": "$5",
  "fammington hotel": "$25",
  "corona hotel": "$10",
};

const getHotelPayment = (hotelName) =>
  hotelPayments[normalizeHotelName(hotelName)] || null;

router.post("/bookings", (req, res) => {
  const {
    customer = null,
    Customers = null,
    email = null,
    Email = null,
    checkIn = null,
    Availability = null,
    checkOut = null,
    Departure = null,
    rooms = null,
    Rooms = null,
    suite = null,
    Suites = null,
    adult = null,
    Adult = null,
    children = null,
    Children = null,
    paymentNumber = null,
    Payment = null,
    hotelName = null,
    Hotels = null,
  } = req.body;

  const selectedHotel = hotelName || Hotels;
  const selectedCustomer = customer || Customers;
  const selectedEmail = email || Email;

  if (!selectedHotel) {
    return res.status(400).json({ error: "Hotel name is required" });
  }

  if (!selectedCustomer || !selectedEmail) {
    return res.status(401).json({
      success: false,
      error: "Please sign up or log in before placing a booking",
    });
  }

  const hotelPayment = getHotelPayment(selectedHotel);

  if (!hotelPayment) {
    return res.status(400).json({
      success: false,
      error: `No payment amount is configured for ${selectedHotel}`,
    });
  }

  const sql = `
    INSERT INTO bookings
    (Customers, Email, PhoneNumbers, Hotels, Amount, Availibilty, Departure, Rooms, Suites, Adult, Children, Payment)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    selectedCustomer,
    selectedEmail,
    paymentNumber || Payment,
    selectedHotel,
    hotelPayment,
    formatDate(checkIn || Availability),
    formatDate(checkOut || Departure),
    rooms || Rooms,
    suite || Suites,
    adult || Adult,
    children || Children,
    hotelPayment,
  ];

  con.query(sql, values, (err, result) => {
    if (err) {
      console.error(
        "Error inserting booking into existing bookings table:",
        err,
      );
      return res.status(500).json({
        success: false,
        error: "Database error",
        details: err.sqlMessage || err.message,
      });
    }

    if (!result) {
      return res.status(500).json({
        success: false,
        error: "Booking insert did not return a result",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Booking Successful",
      bookingId: result.insertId || null,
      payment: hotelPayment,
    });
  });
});

router.post("/hotel-click", (req, res) => {
  const { hotelName } = req.body;

  if (!hotelName) {
    return res.status(400).json({ error: "Hotel name is required" });
  }

  // return res.status(200).json({
  //   success: true,
  //   message: "Hotel selected",
  //   hotelName,
  // });
});

module.exports = router;
