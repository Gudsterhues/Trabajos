// server.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const mysql = require('mysql2/promise');

const app = express();
app.use(express.json());

// 1) Servir tu frontend estático (ProyectoS/)
app.use(express.static(path.join(__dirname, 'ProyectoS')));

// 2) Pool MySQL (usa .env; defaults seguros)
const pool = mysql.createPool({
  host:     process.env.DB_HOST || 'localhost',
  user:     process.env.DB_USER || 'admipay',
  password: process.env.DB_PASSWORD || 'tu_password',
  database: process.env.DB_NAME || 'admiPayDB',
  port:     Number(process.env.DB_PORT || 3306),
  waitForConnections: true,
  connectionLimit: 10,
});

// 3) Health check de DB
app.get('/health-db', async (_req, res) => {
  try {
    const [[row]] = await pool.query('SELECT DATABASE() db, VERSION() ver');
    res.json({ ok: true, db: row.db, version: row.ver });
  } catch (e) {
    res.status(500).json({ ok: false });
  }
});
app.get('/health-db-debug', async (_req, res) => {
  try {
    const [[row]] = await pool.query('SELECT DATABASE() db, VERSION() ver');
    res.json({ ok: true, db: row.db, version: row.ver });
  } catch (e) {
    res.status(500).json({ ok: false, code: e.code, errno: e.errno, sqlState: e.sqlState, message: e.message });
  }
});

/* ================== API USUARIOS ================== */

// Listar
app.get('/api/usuarios', async (_req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, nombre_completo, correo FROM USUARIOS ORDER BY id DESC'
    );
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Listado falló' });
  }
});


app.post('/api/usuarios', async (req, res) => {
  const { nombre_completo, correo } = req.body || {};
  if (!nombre_completo || !correo) {
    return res.status(400).json({ error: 'Faltan campos' });
  }
  try {
    const [r] = await pool.execute(
      'INSERT INTO USUARIOS (nombre_completo, correo) VALUES (?, ?)',
      [nombre_completo, correo]
    );
    res.status(201).json({ id: r.insertId, nombre_completo, correo });
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'El correo ya está registrado' });
    }
    console.error(e);
    res.status(500).json({ error: 'Creación falló' });
  }
});


app.put('/api/usuarios/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre_completo, correo } = req.body || {};
  if (!nombre_completo || !correo) {
    return res.status(400).json({ error: 'Faltan campos' });
  }
  try {
    await pool.execute(
      'UPDATE USUARIOS SET nombre_completo = ?, correo = ? WHERE id = ?',
      [nombre_completo, correo, id]
    );
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Actualización falló' });
  }
});

// Borrar
app.delete('/api/usuarios/:id', async (req, res) => {
  try {
    await pool.execute('DELETE FROM USUARIOS WHERE id = ?', [req.params.id]);
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Borrado falló' });
  }
});

/* ================== API CELULARES ================== */
// Crear celular (id_usuario, numero, tipo)
app.post('/api/celulares', async (req, res) => {
  const { id_usuario, numero, tipo } = req.body || {};
  if (!id_usuario || !numero || !tipo) {
    return res.status(400).json({ error: 'Faltan campos en celulares' });
  }
  try {
    await pool.execute(
      'INSERT INTO CELULARES (id_usuario, numero, tipo) VALUES (?,?,?)',
      [id_usuario, numero, tipo]
    );
    res.status(201).json({ ok: true });
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'El número ya existe' });
    }
    console.error(e);
    res.status(500).json({ error: 'No se pudo registrar el celular' });
  }
});

/* ================== API PAQUETES ================== */
// Crear paquete (id_usuario, tipo, cantidad_clases['4','8','12','16'], precio_actual)
app.post('/api/paquetes', async (req, res) => {
  let { id_usuario, tipo, cantidad_clases, precio_actual = 0 } = req.body || {};
  if (!id_usuario || !tipo || !cantidad_clases) {
    return res.status(400).json({ error: 'Faltan campos en paquetes' });
  }
  // "12 clases" -> "12" (ENUM exige string exacta)
  cantidad_clases = String(parseInt(cantidad_clases, 10));
  try {
    const [r] = await pool.execute(
      'INSERT INTO PAQUETES (id_usuario, tipo, cantidad_clases, precio_actual) VALUES (?,?,?,?)',
      [id_usuario, tipo, cantidad_clases, precio_actual]
    );
    res.status(201).json({ id: r.insertId });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'No se pudo crear el paquete' });
  }
});

/* ============== Fallback SIN wildcard (Express 5) ============== */
app.use((req, res, next) => {
  if (req.method !== 'GET') return next();
  if (req.path.startsWith('/api/')) return res.status(404).json({ error: 'Not found' });
  res.sendFile(path.join(__dirname, 'ProyectoS', 'index.html'));
});

// 5) Arrancar servidor
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Servidor listo: http://localhost:${port}`));
