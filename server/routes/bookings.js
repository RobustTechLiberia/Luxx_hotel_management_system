/* eslint-disable no-undef */
import express from 'express';

const router = express.Router();

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

// NOTE: Changed route string to "/" because it is mounted under "/bookings" in app.js
router.post("/", async (req, res) => {
  try {
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
      return res.status(400).json({ success: false, error: "Hotel name is required" });
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

    // Extraction chain designed to dig into the cloudflare:node abstraction mapping layers
    const env = req.env || req.rawHeaders?.env || globalThis.env;
    const db = env?.DB;

    if (!db) {
      return res.status(500).json({
        success: false,
        error: "D1 Initialization Reference Lost",
        details: "The database binding context was not caught through the httpServerHandler pipeline."
      });
    }

    const sql = `
      INSERT INTO bookings
      (Customers, Email, PhoneNumbers, Hotels, Amount, Availibilty, Departure, Rooms, Suites, Adult, Children, Payment)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const statement = db.prepare(sql).bind(
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
      hotelPayment
    );

    // Run query mutation 
    const result = await statement.run();

    if (!result || !result.success) {
      throw new Error("D1 Engine rejected the storage instruction array payload.");
    }

    return res.status(201).json({
      success: true,
      message: "Booking Successful",
      bookingId: result.meta?.last_row_id || null,
      payment: hotelPayment,
    });

  } catch (err) {
    console.error("D1 transaction error:", err);
    return res.status(500).json({
      success: false,
      error: "Database error processing mutation block",
      details: err.message,
    });
  }
});

router.post("/hotel-click", (req, res) => {
  const { hotelName } = req.body;
  if (!hotelName) {
    return res.status(400).json({ error: "Hotel name is required" });
  }
  return res.status(200).json({
    success: true,
    message: "Hotel selected",
    hotelName,
  });
});

export default router;