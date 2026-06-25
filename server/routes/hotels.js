/* eslint-disable no-undef */
import express from 'express';

const router = express.Router();

const coerceSort = (value) => {
  const v = String(value || '').trim().toLowerCase();
  if (v === 'high' || v === 'price_desc' || v === 'desc') return 'price_desc';
  if (v === 'low' || v === 'lowest' || v === 'price_asc' || v === 'asc') return 'price_asc';
  return null;
};

const DEFAULT_LIMIT = 50;

router.get('/api/hotels', async (req, res) => {
  try {
    const env = req.env || req.raw?.env || globalThis.__LUXX_ENV || {};
    const db = req.db || env?.HOTELS_DB || env?.DB;

    if (!db) {
      return res.status(500).json({
        success: false,
        error: 'D1 Database binding not found',
      });
    }

    const sort = coerceSort(req.query?.sort);
    const limit = Math.min(Number(req.query?.limit || DEFAULT_LIMIT), 200);

    // IMPORTANT:
    // We assume these column names exist in `hotelsdetail`.
    // If your schema uses different names, update the field names below.
    const priceCol = 'price';
    const nameCol = 'hotel_name';
    const imageCol = 'image';

    const orderClause = sort === 'price_asc'
      ? `ORDER BY CAST(${priceCol} AS REAL) ASC`
      : sort === 'price_desc'
        ? `ORDER BY CAST(${priceCol} AS REAL) DESC`
        : `ORDER BY CAST(${priceCol} AS REAL) ASC`;

    // If your price is stored like "$25" the CAST will usually still work in SQLite/D1,
    // but if it does not, we can switch to a safer REPLACE-based extraction.
    const sql = `
      SELECT *
      FROM hotelsdetail
      ${orderClause}
      LIMIT ?
    `;

    const rows = await db.prepare(sql).bind(limit).all();
    const results = rows?.results || rows || [];

    res.json({
      success: true,
      count: results.length,
      sort: sort || 'price_asc',
      hotels: results.map((r) => ({
        // keep flexible: return all fields plus common aliases
        ...r,
        hotelName: r[nameCol] ?? r.hotel ?? r.name ?? r.Hotel ?? null,
        priceNumber: (() => {
          const v = r[priceCol];
          const num = typeof v === 'number' ? v : Number(String(v).replace(/[^0-9.]/g, ''));
          return Number.isFinite(num) ? num : null;
        })(),
        imageUrl: r[imageCol] ?? r.imageUrl ?? r.image_url ?? null,
      })),
    });
  } catch (err) {
    console.error('hotels list error:', err);
    res.status(500).json({ success: false, error: 'Failed to load hotels', details: err.message });
  }
});

export default router;

