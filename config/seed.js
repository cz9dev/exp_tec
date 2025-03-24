/**
 * Este script es para poblar los datos iniciales del sistema
 */

const pool = require('./db');

async function seed() {
  // Insertar roles básicos
  await pool.execute(`
    INSERT INTO roles (nombre, descripcion) VALUES 
    ('admin', 'Administrador del sistema'),
    ('user', 'Usuario estándar')
  `);

  // Insertar permisos
  await pool.execute(`
    INSERT INTO permisos (nombre, descripcion, ruta) VALUES 
    ('VIEW_DASHBOARD', 'Ver panel principal', '/dashboard'),
    ('MANAGE_USERS', 'Gestionar usuarios', '/admin/users')
  `);

  // Asignar permisos a roles
  await pool.execute(`
    INSERT INTO roles_permisos (rol_id, permiso_id) VALUES
    (1, 1), (1, 2),  -- Admin tiene todos los permisos
    (2, 1)           -- User solo puede ver dashboard
  `);
}

seed().then(() => process.exit());