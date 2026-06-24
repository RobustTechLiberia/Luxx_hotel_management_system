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
  "royal grand hotel": {
    price: "$10",
    note: "good for quick city stays",
    amenities: ["desk", "coffee machine", "smart TV"],
    experiences: ["city food walk", "live music night", "downtown market visit"],
    trust: "Best for private stays, couples, and guests who prefer a quieter shared environment.",
  },
  "boluvard hotel": {
    price: "$25",
    note: "best for longer stays",
    amenities: ["coffee machine", "desk", "smart TV", "premium bedding"],
    experiences: ["private cultural guide", "fine dining booking", "art and heritage route"],
    trust: "Best for premium shared accommodations where guest verification and stay purpose matter.",
  },
  "boluvard palace": {
    price: "$25",
    note: "best for longer stays",
    amenities: ["coffee machine", "desk", "smart TV", "premium bedding"],
    experiences: ["private cultural guide", "fine dining booking", "art and heritage route"],
    trust: "Best for premium shared accommodations where guest verification and stay purpose matter.",
  },
  "sinkor palace": {
    price: "$5",
    note: "budget-friendly option",
    amenities: ["desk", "fan", "basic TV"],
    experiences: ["street food suggestions", "neighborhood market", "local transport tips"],
    trust: "Best for budget guests who want simple verification and clear house expectations.",
  },
  "sinkor palace hotel": {
    price: "$5",
    note: "budget-friendly option",
    amenities: ["desk", "fan", "basic TV"],
    experiences: ["street food suggestions", "neighborhood market", "local transport tips"],
    trust: "Best for budget guests who want simple verification and clear house expectations.",
  },
  "bella casa hotel": {
    price: "$5",
    note: "budget-friendly option",
    amenities: ["desk", "coffee tray", "basic TV"],
    experiences: ["quiet cafe list", "local food stops", "community walking route"],
    trust: "Best for quiet budget stays with guest compatibility notes before sharing space.",
  },
  "bella cassa hotel": {
    price: "$5",
    note: "budget-friendly option",
    amenities: ["desk", "coffee tray", "basic TV"],
    experiences: ["quiet cafe list", "local food stops", "community walking route"],
    trust: "Best for quiet budget stays with guest compatibility notes before sharing space.",
  },
  "fammington hotel": {
    price: "$25",
    note: "better for family or business trips",
    amenities: ["family desk", "smart TV", "airport pickup"],
    experiences: ["family cultural outing", "airport area food stops", "local craft market"],
    trust: "Best for families, business travelers, and guests who want compatibility checks before shared stays.",
  },
  "corona hotel": {
    price: "$10",
    note: "balanced mid-range stay",
    amenities: ["desk", "smart TV", "late checkout"],
    experiences: ["local dining guide", "business district tour", "weekend culture stops"],
    trust: "Best for business travelers and guests who want verified, low-noise stays.",
  },
};

const amenityCatalog = [
  { name: "coffee machine", price: "$2" },
  { name: "desk", price: "$1" },
  { name: "smart TV", price: "$3" },
  { name: "late checkout", price: "$2" },
  { name: "airport pickup", price: "$5" },
  { name: "premium bedding", price: "$4" },
];

const normalizeText = (value = "") => String(value).trim().toLowerCase();

const parseBudget = (text) => {
  const match = normalizeText(text).match(/(?:\$|usd\s*)?(\d+(?:\.\d{1,2})?)/);
  return match ? Number(match[1]) : null;
};

const getPriceNumber = (price) => Number(String(price).replace(/[^0-9.]/g, ""));

const findAmenities = (text) =>
  amenityCatalog.filter((item) => normalizeText(text).includes(normalizeText(item.name)));

const getFallbackHotel = (hotelName) => hotelInfo[normalizeText(hotelName)] || null;

const buildNegotiationReply = (text, hotelName, hotel) => {
  const targetHotelName = hotelName || "this hotel";
  const basePrice = getPriceNumber(hotel?.price || "$10");
  const budget = parseBudget(text);

  if (!budget) {
    return `AI price negotiation workflow for ${targetHotelName}: tell me your target budget, dates, room count, and any amenities you want. I will compare that against the ${hotel?.price || "listed"} base price and prepare a hotel approval offer.`;
  }

  if (budget >= basePrice) {
    return `Your USD ${budget} offer meets the ${targetHotelName} base price of ${hotel?.price || `USD ${basePrice}`}. I would submit it as an instant-accept booking request, with room extras approved separately.`;
  }

  const minimumLikely = Math.max(Math.ceil(basePrice * 0.85), 1);
  if (budget >= minimumLikely) {
    return `Your USD ${budget} offer is close for ${targetHotelName}. AI negotiation would send it as a conditional offer with hotel approval required, then payment by Orange Money after acceptance.`;
  }

  return `${targetHotelName} starts at ${hotel?.price || `USD ${basePrice}`}, so USD ${budget} is below the normal negotiation range. A stronger counteroffer is about USD ${minimumLikely}, or I can suggest a $5 budget hotel.`;
};

const buildCustomizationReply = (text, hotelName, hotel) => {
  const targetHotelName = hotelName || "this hotel";
  const requestedAmenities = findAmenities(text);
  const availableAmenities = (hotel?.amenities || ["coffee machine", "desk", "smart TV"]).join(", ");

  if (requestedAmenities.length === 0) {
    return `Room customization workflow for ${targetHotelName}: available add-ons include ${availableAmenities}. Ask me to add or remove a coffee machine, desk, smart TV, late checkout, airport pickup, or premium bedding before booking.`;
  }

  const selected = requestedAmenities.map((item) => `${item.name} (${item.price})`).join(", ");
  return `Customization draft for ${targetHotelName}: add ${selected}. This becomes a pre-booking scope item for hotel approval before payment.`;
};

const buildExperienceReply = (hotelName, hotel) => {
  const targetHotelName = hotelName || "this hotel";
  const experiences = (hotel?.experiences || ["local food stops", "market visit", "music or heritage guide"]).join(", ");
  return `Local experience workflow for ${targetHotelName}: I can attach ${experiences} to the booking scope. Tell me your interest, food, music, markets, family activities, or heritage, and I will match the stay plan.`;
};

const buildTrustReply = (hotelName, hotel) => {
  const targetHotelName = hotelName || "this hotel";
  return `Social trust workflow for shared accommodation at ${targetHotelName}: ${hotel?.trust || "Collect guest verification and compatibility details before shared stays."} The assistant should collect verified guest profile, stay purpose, quiet-hours preference, cleanliness expectations, and host or roommate compatibility notes. Reviews should cover both hotel quality and shared-stay guest trust signals.`;
};

const buildFallbackReply = (message, hotelName) => {
  const text = normalizeText(message);
  const hotel = getFallbackHotel(hotelName);

  if (text.includes("haggle") || text.includes("negotiate") || text.includes("deal") || text.includes("discount") || text.includes("offer")) {
    return buildNegotiationReply(text, hotelName, hotel);
  }

  if (text.includes("custom") || text.includes("amenity") || text.includes("amenities") || text.includes("coffee") || text.includes("desk") || text.includes("smart tv") || text.includes("tv")) {
    return buildCustomizationReply(text, hotelName, hotel);
  }

  if (text.includes("culture") || text.includes("local") || text.includes("experience") || text.includes("food") || text.includes("music") || text.includes("market") || text.includes("tour")) {
    return buildExperienceReply(hotelName, hotel);
  }

  if (text.includes("trust") || text.includes("shared") || text.includes("roommate") || text.includes("guest review") || text.includes("social")) {
    return buildTrustReply(hotelName, hotel);
  }

  if (text.includes("price") || text.includes("cost") || text.includes("payment")) {
    return hotel
      ? `For ${hotelName}, the booking amount is ${hotel.price}. I can also prepare a negotiation offer or room customization scope before you book.`
      : 'Our hotel prices vary by property. Ask me about a specific hotel or tell me your budget and I can prepare a negotiation offer.';
  }

  if (text.includes("book") || text.includes("reserve") || text.includes("room") || text.includes("booking")) {
    return 'Choose a hotel, pick check-in and check-out dates, select rooms and suites, then submit the form with your payment number. Before submitting, I can prepare negotiation, room customization, local experience, and social trust notes.';
  }

  if (text.includes("which") || text.includes("best") || text.includes("recommend")) {
    return hotel
      ? `If you are looking at ${hotelName}, it is ${hotel.note}. I can also compare it by budget, add-ons, cultural experiences, or shared-stay trust.`
      : 'Tell me your budget, travel purpose, amenity needs, and local experience interests, and I will recommend a hotel that fits.';
  }

  if (text.includes("orange money") || text.includes("payment number") || text.includes("phone")) {
    return 'Enter the Orange Money phone number you want to use for payment in the booking form. That number is stored with your reservation.';
  }

  return hotel
    ? `I can help with ${hotelName}. The booking amount is ${hotel.price} and it is ${hotel.note}. I can also prepare negotiation, room customization, local culture, and social trust notes.`
    : 'I can help you choose a hotel, negotiate a room price, customize amenities, add local cultural experiences, review social trust preferences for shared stays, and answer payment questions.';
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
  // NOTE: This endpoint is DEPRECATED. Use the one in routes/users.js instead.
  // That endpoint uses D1 (SQLite) which is the active database binding.
  return res.status(410).json({ 
    success: false, 
    error: "This endpoint is deprecated. Use POST /signup instead.",
    note: "The active registration endpoint is in routes/users.js and uses D1 database."
  });
});

/*
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
*/

export default router;
