import { Router } from 'express';
import { pool, query } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// Create a sale with items and decrement stock
router.post('/', requireAuth, async (req, res) => {
  const c = await pool.connect();
  try {
    const { items } = req.body; // items = [{product_id, quantity, price_cents?}]
    if (!Array.isArray(items) || items.length === 0) {
      c.release();
      return res.status(400).json({ error: "items[] required" });
    }
    await c.query('begin');
    // create sale
    const total = items.reduce((sum, it) => sum + (it.price_cents || 0) * (it.quantity || 0), 0);
    const sale = await c.query(
      `insert into sales (total_cents) values ($1) returning *`, [total]
    );
    const saleId = sale.rows[0].id;
    for (const it of items) {
      const prodRes = await c.query(
        `select id, price_cents, stock from products where id=$1 for update`,
        [it.product_id]
      );
      const product = prodRes.rows[0];
      if (!product) throw new Error('Product not found: ' + it.product_id);
      const price = it.price_cents != null ? it.price_cents : product.price_cents;
      if ((product.stock || 0) < (it.quantity || 0)) {
        throw new Error('Insufficient stock for product ' + it.product_id);
      }
      await c.query(
        `insert into sale_items (sale_id, product_id, quantity, price_cents)
         values ($1,$2,$3,$4)`,
        [saleId, it.product_id, it.quantity, price]
      );
      await c.query(
        `update products set stock = stock - $2 where id = $1`,
        [it.product_id, it.quantity]
      );
    }
    await c.query('commit');
    c.release();
    res.status(201).json({ sale_id: saleId, total_cents: total });
  } catch (e) {
    try { await c.query('rollback'); } catch {}
    c.release();
    res.status(500).json({ error: e.message });
  }
});

// Get sales (optionally by date range)
router.get('/', requireAuth, async (req, res) => {
  try {
    const { from, to } = req.query;
    let sql = `select id, total_cents, created_at from sales`;
    const params = [];
    if (from && to) {
      params.push(from, to);
      sql += ` where created_at between $1 and $2`;
    }
    sql += ` order by created_at desc`;
    const { rows } = await query(sql, params);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
