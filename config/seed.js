/**
 * Este script es para poblar los datos iniciales del sistema
 */

const pool = require('./db');

async function seed() {  
  await insertarRoles();
  await insertarPermisos();
  await asignarPermisosARoles();
  await insertarAreas();
  await insertarMarcas();
  await insertarTiposComponentes();
  await insertarTiposPerifericos();
  await insertarUsuarios();
  await asignarRolesAusuarios();
}
async function insertarRoles() {
  await pool.execute(`
    INSERT INTO roles (nombre, descripcion) VALUES 
    ('admin', 'Administrador del sistema'),
    ('user', 'Usuario estándar')
  `);  
}

async function insertarPermisos() {
  await pool.execute(`
    INSERT INTO permisos (nombre, descripcion, ruta) VALUES 
    ('VIEW_DASHBOARD', 'Ver panel principal', '/dashboard'),
    ('MANAGE_USERS', 'Gestionar usuarios', '/admin/users')
  `);   
}

async function asignarPermisosARoles() {
  await pool.execute(`
    INSERT INTO roles_permisos (rol_id, permiso_id) VALUES
    (1, 1), (1, 2),  -- Admin tiene todos los permisos
    (2, 1)           -- User solo puede ver dashboard
  `);  
}

async function insertarAreas() {
  await pool.query(`
    INSERT INTO area (nombre) VALUES 
    ('Sistemas'),
    ('Administración'),
    ('Contabilidad')
  `);
}

async function insertarMarcas() {
  await pool.query(`
    INSERT INTO marca (marca) VALUES
    ('Dell'),
    ('HP'),
    ('Lenovo'),
    ('Asus')
  `);
}

async function insertarTiposComponentes() {
  await pool.query(`
    INSERT INTO tipo_componente (nombre) VALUES
    ('Procesador'),
    ('Memoria RAM'),
    ('Disco Duro'),
    ('Tarjeta Madre')
  `);
}

async function insertarTiposPerifericos() {
  await pool.query(`
    INSERT INTO tipo_periferico (nombre) VALUES
    ('Impresora'),
    ('Monitor'),
    ('Teclado'),
    ('Mouse')
  `);
}

async function insertarUsuarios() {
  await pool.query(`
    INSERT INTO usuarios (username, email, password_hash, nombre, apellido) VALUES
    ('admin', 'admin@example.com', '$2b$10$X/s.g9z24/V37Zq.6f.j6eM4gB/h4c867.a4z6Yp.zI.j5Z5h237G', 'Admin', 'Admin'),
    ('user', 'user@example.com', '$2b$10$X/s.g9z24/V37Zq.6f.j6eM4gB/h4c867.a4z6Yp.zI.j5Z5h237G', 'User', 'User')
  `);
}

async function asignarRolesAusuarios() {
  await pool.query(`
    INSERT INTO usuarios_roles (usuario_id, rol_id) VALUES
    (1,1),
    (2,2)
  `);
}

seed().then(() => process.exit());