const { Sequelize, DataTypes } = require("sequelize");

const host = process.env.DB_HOST || "localhost";
const database = process.env.DB_NAME || "database";
const user = process.env.DB_USER || "user";
const password = process.env.DB_PASS || "password";
const dialect = process.env.DB_DIALECT || "mysql"; // o 'postgres', 'sqlite', etc.

const sequelize = new Sequelize(database, user, password, {
  host: host,
  dialect: dialect,
});

/**
 * Definición de modelo Tipo componente
 */
const TipoComponente = sequelize.define(
  "tipo_componente",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  { tableName: "tipo_componente" }
);

/**
 * Definición de modelo Tipo periferico
 */
const TipoPeriferico = sequelize.define(
  "tipo_periferico",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  { tableName: "tipo_periferico" }
);

/**
 * Definicion de modelo Area
 */
const Area = sequelize.define(
  "area",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  { tableName: "area" }
);

// Definición del modelo Trabajador
const Trabajadores = sequelize.define("trabajadores", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  ci: {
    type: DataTypes.STRING(11),
    allowNull: false,
    unique: true,
  },
  nombres: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  apellidos: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

Trabajadores.belongsTo(Area, { foreignKey: "id_area" }); // Un trabajador pertenece a un area

/**
 * Definición de modelo Marca
 */
const Marca = sequelize.define(
  "marca",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    marca: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  { tableName: "marca" }
);

const Periferico = sequelize.define(
  "periferico",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    modelo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    numero_serie: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    numero_inventario: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    url_image: {
      type: DataTypes.STRING,
      unique: true,
    },
  },
  { tableName: "periferico" }
);

Periferico.belongsTo(Marca, { foreignKey: "id_marca" }); // Un periferico pertenece a una marca
Periferico.belongsTo(TipoPeriferico, { foreignKey: "id_tipo_periferico" }); // Un periferico pertenece a un tipo de periferico

/**
 * Definición de modelo Permisos
 */
const Permisos = sequelize.define("permisos", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  descripcion: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  ruta: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

/**
 * Definición de modelo Roles
 */
const Roles = sequelize.define("roles", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  descripcion: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

const RolesPermisos = sequelize.define("roles_permisos", {});

RolesPermisos.belongsTo(Roles, { foreignKey: "rol_id" });
RolesPermisos.belongsTo(Permisos, { foreignKey: "permiso_id" });

/**
 * Definición de modelo usuarios
 */
const Usuarios = sequelize.define("usuarios", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  apellido: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  activo: {
    type: DataTypes.TINYINT,
    allowNull: true,
    defaultValue: 1,
  },
  fecha_creacion: {
    type: DataTypes.TIME,
    allowNull: false,
    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
  },
  ultimo_login: {
    type: DataTypes.TIME,
    allowNull: true,
    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
  },
  token_recuperacion: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  token_expiracion: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  profile_image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

const UsuariosRoles = sequelize.define("usuarios_roles", {});

UsuariosRoles.belongsTo(Usuarios, { foreignKey: "usuario_id" });
UsuariosRoles.belongsTo(Roles, { foreignKey: "rol_id" });

/**
 * Definición de modelo UsuariosWidgets
 */
const UsuariosWidgets = sequelize.define("usuarios_widgets", {
  widgets: {
    type: DataTypes.JSON, // Usar JSON para almacenar datos de widgets
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    onUpdate: Sequelize.literal("CURRENT_TIMESTAMP"),
  },
});

// Definir la relación con el modelo Usuarios (Uno a Uno)
Usuarios.hasOne(UsuariosWidgets, { foreignKey: "usuarios_id" }); // Un usuario tiene un objeto UsuariosWidgets
UsuariosWidgets.belongsTo(Usuarios, { foreignKey: "usuarios_id" }); // UsuariosWidgets pertenece a un usuario

// Definición del modelo Dispositivo
const Dispositivo = sequelize.define(
  "dispositivo",
  {
    tipo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    inventario: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    nombre: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    ip: {
      type: DataTypes.STRING(20),
      unique: true,
    },
    estado: {
      type: DataTypes.ENUM("activo", "roto"),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      onUpdate: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    deleted_at: {
      type: DataTypes.DATE,
    },
  },
  { tableName: "dispositivo" }
);

Dispositivo.belongsTo(Usuarios, { foreignKey: "id_trabajador" }); // Un dispositivo pertenece a un usuario
Dispositivo.belongsTo(Area, { foreignKey: "id_area" }); // Un dispositivo pertenece a un área

// Definición del modelo Componente
const Componente = sequelize.define(
  "componente",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    modelo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    numero_serie: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    url_image: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
  },
  { tableName: "componente" }
);

Componente.belongsTo(Marca, { foreignKey: "id_marca" }); // Un componente pertenece a una marca
Componente.belongsTo(TipoComponente, { foreignKey: "id_tipo_componente" }); // Un componente pertenece a un tipo de componente

const DispositivoAuditoria = sequelize.define("dispositivo_auditoria", {
  tipo_cambio: {
    type: DataTypes.ENUM(
      "asignar_componente",
      "desasignar_componente",
      "asignar_periferico",
      "desasignar_periferico",
      "actualizar_dispositivo"
    ),
  },
  datos_antes: {
    type: DataTypes.JSON,
  },
  datos_despues: {
    type: DataTypes.JSON,
  },
  fecha_hora: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
  },
});

DispositivoAuditoria.belongsTo(Dispositivo, { foreignKey: "dispositivo_id" });
DispositivoAuditoria.belongsTo(Usuarios, { foreignKey: "usuario_id" });

const DispositivoComponente = sequelize.define(
  "dispositivo_componente",
  {},
  { tableName: "dispositivo_componente" }
);

DispositivoComponente.belongsTo(Dispositivo, { foreignKey: "id_dispositivo" });
DispositivoComponente.belongsTo(Componente, { foreignKey: "id_componente" });

const DispositivoPeriferico = sequelize.define(
  "dispositivo_periferico",
  {},
  { tableName: "dispositivo_periferico" }
);

DispositivoPeriferico.belongsTo(Dispositivo, { foreignKey: "id_dispositivo" });
DispositivoPeriferico.belongsTo(Periferico, { foreignKey: "id_periferico" });

const DispositivoSello = sequelize.define(
  "dispositivo_sello",
  {
    sello: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fecha_cambio: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
  },
  { tableName: "dispositivo_sello" }
);

DispositivoSello.belongsTo(Dispositivo, { foreignKey: "id_dispositivo" });
DispositivoSello.belongsTo(Usuarios, { foreignKey: "id_usuario" });
DispositivoSello.belongsTo(Trabajadores, { foreignKey: "id_testigo" });

const Incidencia = sequelize.define("incidencia", {
  tipo_incidencia: {
    type: DataTypes.ENUM("hardware", "software", "mantenimiento"),
    allowNull: false,
  },
  fecha_incidencia: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  resuelto: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  conforme: {
    type: DataTypes.BOOLEAN,
  },
});

Incidencia.belongsTo(Dispositivo, { foreignKey: "id_dispositivo" });
Incidencia.belongsTo(Usuarios, { foreignKey: "id_usuario" });
Incidencia.belongsTo(Trabajadores, { foreignKey: "id_trabajador" }); // asumiendo que existe el modelo trabajador

const LogsAcceso = sequelize.define("logs_acceso", {
  accion: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  ruta: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  ip_address: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  user_agent: {
    type: DataTypes.TEXT,
  },
  creado_en: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
  },
});

LogsAcceso.belongsTo(Usuarios, { foreignKey: "usuario_id" });

module.exports = {
  sequelize,
  Area,
  Componente,
  Dispositivo,
  DispositivoAuditoria,
  DispositivoComponente,
  DispositivoPeriferico,
  DispositivoSello,
  Incidencia,
  LogsAcceso,
  Marca,
  Periferico,
  Permisos,
  Roles,
  RolesPermisos,
  TipoComponente,
  TipoPeriferico,
  Trabajadores,
  Usuarios,
  UsuariosRoles,
  UsuariosWidgets,
};
