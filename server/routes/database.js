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