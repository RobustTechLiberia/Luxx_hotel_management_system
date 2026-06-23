import express from 'express';
import { createConnection } from 'mysql2/promise';

const router = express.Router();

async function getDBConnection(req) {
  const rawRequest = req.raw || req;
  const env = rawRequest.env;
  
  return await createConnection({
    host: env.HYPERDRIVE.host,
    port: env.HYPERDRIVE.port,
    user: env.HYPERDRIVE.user,
    password: env.HYPERDRIVE.password,
    database: env.HYPERDRIVE.database,
    disableEval: true,
  });
}

const hotelInfo = {
  "royal grand hotel": { price: "$10", note: "good for quick city stays" },
  "boluvard hotel": { price: "$25", note: "best for longer stays" },
  "boluvard palace": { price: "$25", note: "best for longer stays" },
  "sinkor palace": { price: "$5", note: "budget-friendly option" },
  "sinkor palace hotel": { price: "$5", note: "budget-friendly option" },
  "bella casa hotel": { price: "$5", note: "budget-friendly option" },
  "bella cassa hotel": { price: "$5", note: "budget-friendly option" },
  "fammington hotel": { price: "$25", note: "better for family or business trips" },
  "corona hotel": { price: "$10", note: "balanced mid-range stay" },
};

const normalizeText = (value = "") => String(value).trim().toLowerCase();

const buildFallbackReply = (message, hotelName) => {
  const text = normalizeText(message);
  const hotel = hotelInfo[normalizeText(hotelName)] || null;

  if (text.includes("price") || text.includes("cost") || text.includes("payment")) {
    return hotel
      ? `For ${hotelName}, the booking amount is ${hotel.price}. You can enter your Orange Money number in the booking form to continue.`
      : 'Our hotel prices vary by property. Ask me about a specific hotel and I will tell you the booking amount.';
  }

  if (text.includes("book") || text.includes("reserve") || text.includes("room") || text.includes("booking")) {
    return 'Choose a hotel, pick your check-in and check-out dates, select rooms and suites, then submit the form with your payment number. I can help you narrow down the best option if you want.';
  }

  if (text.includes("which") || text.includes("best") || text.includes("recommend")) {
    return hotel
      ? `If you are looking at ${hotelName}, it is ${hotel.note}.`
      : 'Tell me your budget and the kind of stay you want, and I will recommend a hotel that fits.';
  }

  if (text.includes("orange money") || text.includes("payment number") || text.includes("phone")) {
    return 'Enter the Orange Money phone number you want to use for payment in the booking form. That number is stored with your reservation.';
  }

  return hotel
    ? `I can help with ${hotelName}. The booking amount is ${hotel.price} and it is ${hotel.note}.`
    : 'I can help you choose a hotel, explain booking steps, and answer payment questions. Ask me anything about reserving a room.';
};

router.post('/chat', async (req, res) => {
  const { messages = [], hotelName = '', context = '' } = req.body || {};
  const lastMessage = messages.length ? messages[messages.length - 1] : null;
  const userText = normalizeText(lastMessage?.text || '');

  if (!userText) {
    return res.status(400).json({ success: false, error: 'A user message is required.' });
  }

  const env = req.env || req.raw?.env || globalThis.__LUXX_ENV || {};

  try {
    if (env.AI?.run) {
      const promptMessages = [
        { role: 'system', content: context || 'You are a hotel booking assistant.' },
        ...messages.map((message) => ({
          role: message.role === 'assistant' ? 'assistant' : 'user',
          content: message.text,
        })),
      ];

      const aiResponse = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
        messages: promptMessages,
      });

      const reply = aiResponse?.response || aiResponse?.result || aiResponse?.text || aiResponse?.output || '';
      if (reply) {
        return res.json({ success: true, reply });
      }
    }
  } catch (error) {
    console.error('AI chat fallback error:', error);
  }

  return res.json({
    success: true,
    reply: buildFallbackReply(userText, hotelName),
  });
});

router.post('/api/users/register', async (req, res) => {
  const { username, email, password } = req.body;
  
  if (!username || !email || !password) {
    return res.status(400).json({ success: false, error: "Missing registration fields." });
  }

  let connection;
  try {
    connection = await getDBConnection(req);
    
    await connection.query(`
      CREATE TABLE IF NOT EXISTS user_credentials (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    const [result] = await connection.query(
      'INSERT INTO user_credentials (username, email, password) VALUES (?, ?, ?)',
      [username, email, password]
    );

    res.status(201).json({ 
      success: true, 
      message: "User created successfully!", 
      userId: result.insertId 
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ success: false, error: "This email is already registered." });
    } else {
      res.status(500).json({ success: false, error: error.message });
    }
  } finally {
    if (connection) await connection.end();
  }
});

router.post('/api/bookings/create', async (req, res) => {
  const { 
    user_id, check_in, check_out, adults, children, 
    rooms, suite_type, mobile_money_account 
  } = req.body;

  if (!user_id || !check_in || !check_out || !mobile_money_account || !suite_type) {
    return res.status(400).json({ success: false, error: "Required booking criteria missing." });
  }

  let connection;
  try {
    connection = await getDBConnection(req);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        check_in DATE NOT NULL,
        check_out DATE NOT NULL,
        adults INT NOT NULL DEFAULT 1,
        children INT NOT NULL DEFAULT 0,
        rooms INT NOT NULL DEFAULT 1,
        suite_type VARCHAR(100) NOT NULL,
        mobile_money_account VARCHAR(50) NOT NULL,
        payment_status ENUM('pending', 'paid', 'failed') DEFAULT 'pending',
        booking_status ENUM('pending', 'approved', 'declined') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES user_credentials(id) ON DELETE CASCADE
      )
    `);

    const [result] = await connection.query(
      `INSERT INTO bookings 
      (user_id, check_in, check_out, adults, children, rooms, suite_type, mobile_money_account, payment_status, booking_status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', 'pending')`,
      [user_id, check_in, check_out, adults || 1, children || 0, rooms || 1, suite_type, mobile_money_account]
    );

    res.status(201).json({
      success: true,
      message: "Booking submitted! Status set to pending approval.",
      bookingId: result.insertId
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  } finally {
    if (connection) await connection.end();
  }
});

router.patch('/api/bookings/:id/status', async (req, res) => {
  const bookingId = req.params.id;
  const { status } = req.body;

  if (!['approved', 'declined'].includes(status)) {
    return res.status(400).json({ success: false, error: "Invalid status selection value." });
  }

  let connection;
  try {
    connection = await getDBConnection(req);
    
    const [result] = await connection.query(
      'UPDATE bookings SET booking_status = ? WHERE id = ?',
      [status, bookingId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: "Booking ID not found." });
    }

    res.json({ success: true, message: `Booking has been successfully ${status}.` });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  } finally {
    if (connection) await connection.end();
  }
});

export default router;
