/* eslint-disable no-undef */
import express from 'express';
import {
  buildBookingConfirmationEmail,
  sendTransactionalEmail,
} from '../utils/email.js';

const router = express.Router();

const formatDate = (dateValue) => {
  if (!dateValue) return null;
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return dateValue;
  return date.toISOString().slice(0, 10);
};

const normalizeHotelName = (hotelName) =>
  hotelName.toString().trim().toLowerCase().replace(/\s+/g, ' ');

const hotelPayments = {
  'royal grand hotel': '$10',
  'boluvard hotel': '$25',
  'boluvard palace': '$25',
  'sinkor palace': '$5',
  'sinkor palace hotel': '$5',
  'bella cassa': '$5',
  'bella cassa hotel': '$5',
  'bella casa hotel': '$5',
  'fammington hotel': '$25',
  'corona hotel': '$10',
};

const getHotelPayment = (hotelName) =>
  hotelPayments[normalizeHotelName(hotelName)] || null;

const ensureBookingsTable = async (db) => {
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer TEXT,
      email TEXT,
      hotel TEXT NOT NULL,
      check_in TEXT,
      check_out TEXT,
      children INTEGER DEFAULT 0,
      adult INTEGER DEFAULT 0,
      rooms INTEGER DEFAULT 1,
      suite TEXT,
      mobile_money TEXT,
      amount TEXT,
      payment_status TEXT NOT NULL DEFAULT 'pending',
      booking_status TEXT NOT NULL DEFAULT 'pending',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `).run();

  const existingColumns = await db.prepare('PRAGMA table_info(bookings)').all();
  const columnNames = new Set((existingColumns.results || []).map((column) => column.name));
  const requiredColumns = [
    ['customer', 'TEXT'],
    ['email', 'TEXT'],
    ['hotel', 'TEXT'],
    ['check_in', 'TEXT'],
    ['check_out', 'TEXT'],
    ['children', 'INTEGER DEFAULT 0'],
    ['adult', 'INTEGER DEFAULT 0'],
    ['rooms', 'INTEGER DEFAULT 1'],
    ['suite', 'TEXT'],
    ['mobile_money', 'TEXT'],
    ['amount', 'TEXT'],
    ['payment_status', "TEXT NOT NULL DEFAULT 'pending'"],
    ['booking_status', "TEXT NOT NULL DEFAULT 'pending'"],
    ['created_at', 'TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP'],
  ];

  for (const [name, definition] of requiredColumns) {
    if (!columnNames.has(name)) {
      await db.prepare(`ALTER TABLE bookings ADD COLUMN ${name} ${definition}`).run();
    }
  }
};

router.post('/', async (req, res) => {
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
      return res.status(400).json({ success: false, error: 'Hotel name is required' });
    }

    if (!selectedCustomer || !selectedEmail) {
      return res.status(401).json({
        success: false,
        error: 'Please sign up or log in before placing a booking',
      });
    }

    const hotelPayment = getHotelPayment(selectedHotel);

    if (!hotelPayment) {
      return res.status(400).json({
        success: false,
        error: `No payment amount is configured for ${selectedHotel}`,
      });
    }

    const db = req.db || req.env?.HOTELS_DB || req.env?.DB;

    if (!db) {
      return res.status(500).json({
        success: false,
        error: 'D1 Initialization Reference Lost',
        details: 'HOTELS_DB was not available on the Cloudflare Worker environment.',
      });
    }

    await ensureBookingsTable(db);

    const booking = {
      customer: selectedCustomer,
      email: selectedEmail,
      hotel: selectedHotel,
      checkIn: formatDate(checkIn || Availability),
      checkOut: formatDate(checkOut || Departure),
      children: children || Children || 0,
      adult: adult || Adult || 0,
      rooms: rooms || Rooms || 1,
      suite: suite || Suites || '',
      mobileMoney: paymentNumber || Payment || '',
      amount: hotelPayment,
    };

    const sql = `
      INSERT INTO bookings
      (customer, email, hotel, check_in, check_out, children, adult, rooms, suite, mobile_money, amount, payment_status, booking_status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', 'pending')
    `;

    const result = await db.prepare(sql).bind(
      booking.customer,
      booking.email,
      booking.hotel,
      booking.checkIn,
      booking.checkOut,
      booking.children,
      booking.adult,
      booking.rooms,
      booking.suite,
      booking.mobileMoney,
      booking.amount,
    ).run();

    if (!result || !result.success) {
      throw new Error('D1 rejected the booking insert.');
    }

    const bookingId = result.meta?.last_row_id || null;
    let emailResult = { sent: false, provider: null };
    let emailError = null;

    try {
      const confirmation = buildBookingConfirmationEmail({ ...booking, bookingId });
      emailResult = await sendTransactionalEmail(req.env || {}, {
        to: booking.email,
        ...confirmation,
      });
    } catch (err) {
      emailError = err.message;
      console.error('Booking confirmation email error:', err);
    }

    return res.status(201).json({
      success: true,
      message: emailResult.sent
        ? 'Booking Successful. Confirmation email sent.'
        : 'Booking Successful. Confirmation email could not be sent.',
      bookingId,
      payment: hotelPayment,
      emailSent: emailResult.sent,
      emailProvider: emailResult.provider,
      emailError,
    });
  } catch (err) {
    console.error('D1 transaction error:', err);
    return res.status(500).json({
      success: false,
      error: 'Database error processing mutation block',
      details: err.message,
    });
  }
});

router.post('/hotel-click', (req, res) => {
  const { hotelName } = req.body;
  if (!hotelName) {
    return res.status(400).json({ error: 'Hotel name is required' });
  }
  return res.status(200).json({
    success: true,
    message: 'Hotel selected',
    hotelName,
  });
});

export default router;
