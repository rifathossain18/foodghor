// Cloudflare Pages Functions — Full API for FoodGhor
interface Env { DB: D1Database; }

const json = (data: any, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

// ============ Mappers (DB row ↔ JS object) ============
const rowToProduct = (r: any) => ({
  id: r.id, slug: r.slug, name: r.name, banglaName: r.bangla_name,
  category: r.category, price: r.price, regularPrice: r.regular_price,
  unit: r.unit, inStock: r.in_stock === 1, stockCount: r.stock_count,
  image: r.image,
  galleryImages: r.gallery_images ? JSON.parse(r.gallery_images) : [],
  shortDescription: r.short_description || '',
  landingConfig: r.landing_config ? JSON.parse(r.landing_config) : {},
});

const productToRow = (p: any) => [
  p.id, p.slug, p.name, p.banglaName, p.category, p.price, p.regularPrice,
  p.unit, p.inStock ? 1 : 0, p.stockCount || 50, p.image,
  JSON.stringify(p.galleryImages || []),
  p.shortDescription || '',
  JSON.stringify(p.landingConfig || {}),
];

const rowToBanner = (r: any) => ({
  id: r.id, title: r.title, subtitle: r.subtitle, tag: r.tag || '',
  imageUrl: r.image_url, linkUrl: r.link_url, buttonText: r.button_text,
  active: r.active === 1, order: r.sort_order,
});
const bannerToRow = (b: any) => [
  b.id, b.title, b.subtitle, b.tag || '', b.imageUrl, b.linkUrl, b.buttonText,
  b.active ? 1 : 0, b.order || 1,
];

const rowToOrder = (r: any) => ({
  id: r.id, userId: r.user_id, customerName: r.customer_name,
  customerPhone: r.customer_phone, customerEmail: r.customer_email || '',
  customerAddress: r.customer_address, customerCity: r.customer_city,
  customerNote: r.customer_note || '',
  items: JSON.parse(r.items || '[]'),
  subtotal: r.subtotal, deliveryCharge: r.delivery_charge, total: r.total,
  status: r.status, courierName: r.courier_name, trackingCode: r.tracking_code || '',
  trackingHistory: JSON.parse(r.tracking_history || '[]'),
  paymentMethod: r.payment_method, createdAt: r.created_at,
});
const orderToRow = (o: any) => [
  o.id, o.userId || null, o.customerName, o.customerPhone, o.customerEmail || '',
  o.customerAddress, o.customerCity, o.customerNote || '',
  JSON.stringify(o.items || []), o.subtotal, o.deliveryCharge, o.total,
  o.status, o.courierName, o.trackingCode || null,
  JSON.stringify(o.trackingHistory || []), o.paymentMethod,
];

const rowToUser = (r: any) => ({
  id: r.id, name: r.name, phone: r.phone, email: r.email,
  address: r.address || '', city: r.city || 'Inside Dhaka',
  createdAt: r.created_at, totalOrders: r.total_orders || 0,
  totalSpent: r.total_spent || 0, status: r.status || 'Active',
});
const userToRow = (u: any) => [
  u.id, u.name, u.phone, u.email, u.address || '', u.city || 'Inside Dhaka',
  u.totalOrders || 0, u.totalSpent || 0, u.status || 'Active',
];

// ============ Resource Handlers ============
async function handleProducts(db: D1Database, method: string, id?: string, body?: any) {
  if (method === 'GET' && !id) {
    const r = await db.prepare('SELECT * FROM products').all();
    return json((r.results || []).map(rowToProduct));
  }
  if (method === 'GET' && id) {
    const r = await db.prepare('SELECT * FROM products WHERE id=?').bind(id).first();
    return r ? json(rowToProduct(r)) : json({ error: 'Not found' }, 404);
  }
  if (method === 'POST' || method === 'PUT') {
    await db.prepare(
      `INSERT OR REPLACE INTO products
       (id,slug,name,bangla_name,category,price,regular_price,unit,in_stock,
        stock_count,image,gallery_images,short_description,landing_config)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
    ).bind(...productToRow(body)).run();
    return json(body, 200);
  }
  if (method === 'DELETE' && id) {
    await db.prepare('DELETE FROM products WHERE id=?').bind(id).run();
    return json({ success: true });
  }
  return json({ error: 'Bad method' }, 405);
}

async function handleBanners(db: D1Database, method: string, id?: string, body?: any) {
  if (method === 'GET') {
    const r = await db.prepare('SELECT * FROM banners ORDER BY sort_order ASC').all();
    return json((r.results || []).map(rowToBanner));
  }
  if (method === 'POST' || method === 'PUT') {
    await db.prepare(
      `INSERT OR REPLACE INTO banners
       (id,title,subtitle,tag,image_url,link_url,button_text,active,sort_order)
       VALUES (?,?,?,?,?,?,?,?,?)`
    ).bind(...bannerToRow(body)).run();
    return json(body);
  }
  if (method === 'DELETE' && id) {
    await db.prepare('DELETE FROM banners WHERE id=?').bind(id).run();
    return json({ success: true });
  }
  return json({ error: 'Bad method' }, 405);
}

async function handleOrders(db: D1Database, method: string, id?: string, body?: any) {
  if (method === 'GET') {
    const r = await db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all();
    return json((r.results || []).map(rowToOrder));
  }
  if (method === 'POST' || method === 'PUT') {
    await db.prepare(
      `INSERT OR REPLACE INTO orders
       (id,user_id,customer_name,customer_phone,customer_email,customer_address,
        customer_city,customer_note,items,subtotal,delivery_charge,total,status,
        courier_name,tracking_code,tracking_history,payment_method)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
    ).bind(...orderToRow(body)).run();
    return json(body);
  }
  if (method === 'DELETE' && id) {
    await db.prepare('DELETE FROM orders WHERE id=?').bind(id).run();
    return json({ success: true });
  }
  return json({ error: 'Bad method' }, 405);
}

async function handleUsers(db: D1Database, method: string, id?: string, body?: any) {
  if (method === 'GET') {
    const r = await db.prepare('SELECT * FROM users ORDER BY created_at DESC').all();
    return json((r.results || []).map(rowToUser));
  }
  if (method === 'POST' || method === 'PUT') {
    await db.prepare(
      `INSERT OR REPLACE INTO users
       (id,name,phone,email,address,city,total_orders,total_spent,status)
       VALUES (?,?,?,?,?,?,?,?,?)`
    ).bind(...userToRow(body)).run();
    return json(body);
  }
  if (method === 'DELETE' && id) {
    await db.prepare('DELETE FROM users WHERE id=?').bind(id).run();
    return json({ success: true });
  }
  return json({ error: 'Bad method' }, 405);
}

async function handleKeyed(db: D1Database, key: string, method: string, body?: any) {
  if (method === 'GET') {
    const r = await db.prepare('SELECT value FROM settings WHERE key=?').bind(key).first();
    if (!r) return json(null);
    try { return json(JSON.parse((r as any).value)); }
    catch { return json(null); }
  }
  if (method === 'PUT' || method === 'POST') {
    await db.prepare('INSERT OR REPLACE INTO settings (key,value) VALUES (?,?)')
      .bind(key, JSON.stringify(body)).run();
    return json(body);
  }
  return json({ error: 'Bad method' }, 405);
}

// ============ Main Router ============
export const onRequest: any = async (context: any) => {
  const { request, env } = context;
  const db = env.DB as D1Database;
  const method = request.method;
  const url = new URL(request.url);
  const parts = url.pathname.split('/').filter(Boolean);
  const resource = parts[1];
  const id = parts[2];

  let body: any = null;
  if (method === 'POST' || method === 'PUT') {
    try { body = await request.json(); } catch { body = {}; }
  }

  try {
    switch (resource) {
      case 'products': return handleProducts(db, method, id, body);
      case 'banners': return handleBanners(db, method, id, body);
      case 'orders': return handleOrders(db, method, id, body);
      case 'users': return handleUsers(db, method, id, body);
      case 'settings': return handleKeyed(db, 'main', method, body);
      case 'courier': return handleKeyed(db, 'courier', method, body);
      case 'pixel': return handleKeyed(db, 'pixel', method, body);
      case 'health': return json({ ok: true, time: new Date().toISOString() });
      default: return json({ error: 'Not found' }, 404);
    }
  } catch (e: any) {
    console.error('API error:', e);
    return json({ error: e.message || 'Server error' }, 500);
  }
};