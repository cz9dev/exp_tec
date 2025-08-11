const { Sequelize, DataTypes } = require("sequelize");
const envLoader = require("../config/envLoader");

async function seedData() {
  const sequelize = new Sequelize({
    database: envLoader.get("DB_NAME"),
    username: envLoader.get("DB_USER"),
    password: envLoader.get("DB_PASS"),
    host: envLoader.get("DB_HOST"),
    dialect: envLoader.get("DB_DIALECT") || "mysql",
    logging: console.log, // Opcional: para ver las queries SQL
  });

  try {
    // Verificar conexión
    await sequelize.authenticate();
    console.log("Conexión a DB verificada para seed");

    // Obtener modelos usando esta conexión
    const {
      Permisos,
      Roles,
      RolesPermisos,
      Usuarios,
      UsuariosRoles,
      Area,
      Marca,
      TipoComponente,
      TipoPeriferico,
    } = require("../models/index")(sequelize);

    // Sincronizar modelos
    await sequelize.sync({ alter: true });

    // Insertar Roles
    await Roles.bulkCreate(
      [
        { nombre: "admin", descripcion: "Administrador del sistema" },
        { nombre: "operador", descripcion: "Operador del sistema" },
        { nombre: "user", descripcion: "Usuario estándar" },
      ]
    );

    // Insertar Permisos
    await Permisos.bulkCreate([
      {
        nombre: "VIEW_DASHBOARD",
        descripcion: "Ver panel principal",
        ruta: "/dashboard",
      },
      {
        nombre: "VIEW_REPORTS",
        descripcion: "Ver Reportes",
        ruta: "/dashboard/reports",
      },
      {
        nombre: "VIEW_USERS",
        descripcion: "Ver usuarios",
        ruta: "/dashboard/users",
      },
      {
        nombre: "MANAGE_USERS",
        descripcion: "Gestionar usuarios",
        ruta: "/dashboard/users",
      },
      {
        nombre: "VIEW_ROLES",
        descripcion: "Ver roles",
        ruta: "/dashboard/roles",
      },
      {
        nombre: "MANAGE_ROLES",
        descripcion: "Gestionar roles",
        ruta: "/dashboard/roles",
      },
      {
        nombre: "VIEW_PERMISSIONS",
        descripcion: "Ver Permisos",
        ruta: "/dashboard/permissions",
      },
      {
        nombre: "MANAGE_PERMISSIONS",
        descripcion: "Gestionar Permisos",
        ruta: "/dashboard/permissions",
      },
      {
        nombre: "VIEW_BRANDS",
        descripcion: "Ver Marcas",
        ruta: "/dashboard/brands",
      },
      {
        nombre: "MANAGE_BRANDS",
        descripcion: "Gestionar Marcas",
        ruta: "/dashboard/brands",
      },
      {
        nombre: "VIEW_AREAS",
        descripcion: "Ver Areas",
        ruta: "/dashboard/areas",
      },
      {
        nombre: "MANAGE_AREAS",
        descripcion: "Gestionar Areas",
        ruta: "/dashboard/areas",
      },
      {
        nombre: "VIEW_TRABAJADORES",
        descripcion: "Ver trabajadores",
        ruta: "/dashboard/trabajadores",
      },
      {
        nombre: "MANAGE_TRABAJADORES",
        descripcion: "Gestionar trabajadores",
        ruta: "/dashboard/trabajadores",
      },
      {
        nombre: "VIEW_COMPONENT_TYPES",
        descripcion: "Ver tipos de componentes",
        ruta: "/dashboard/componentTypes",
      },
      {
        nombre: "MANAGE_COMPONENT_TYPES",
        descripcion: "Gestionar tipos de componentes",
        ruta: "/dashboard/componentTypes",
      },
      {
        nombre: "VIEW_COMPONENT",
        descripcion: "Ver Componentes",
        ruta: "/dashboard/component",
      },
      {
        nombre: "MANAGE_COMPONENTS",
        descripcion: "Gestionar componentes",
        ruta: "/dashboard/component",
      },
      {
        nombre: "VIEW_PERIPHERALS_TYPES",
        descripcion: "Ver tipos de perifericos",
        ruta: "/dashboard/peripheralsTypes",
      },
      {
        nombre: "MANAGE_PERIPHERALS_TYPES",
        descripcion: "Gestionar tipos de perifericos",
        ruta: "/dashboard/peripheralsTypes",
      },
      {
        nombre: "VIEW_PERIPHERALS",
        descripcion: "Ver perifericos",
        ruta: "/dashboard/peripherals",
      },
      {
        nombre: "MANAGE_PERIPHERALS",
        descripcion: "Gestionar perifericos",
        ruta: "/dashboard/peripherals",
      },
      {
        nombre: "VIEW_DEVICES",
        descripcion: "Ver dispositivos",
        ruta: "/dashboard/device",
      },
      {
        nombre: "MANAGE_DEVICES",
        descripcion: "Gestionar dispositivos",
        ruta: "/dashboard/device",
      },
      {
        nombre: "VIEW_INCIDENCES",
        descripcion: "Ver Incidencias",
        ruta: "/dashboard/incidencias",
      },
      {
        nombre: "MANAGE_INCIDENCES",
        descripcion: "Gestionar Incidencias",
        ruta: "/dashboard/incidencias",
      },
      {
        nombre: "VIEW_SELLOS",
        descripcion: "Ver Sellos",
        ruta: "/dashboard/sellos",
      },
      {
        nombre: "MANAGE_SELLOS",
        descripcion: "Gestionar Sellos",
        ruta: "/dashboard/sellos",
      },
      {
        nombre: "VIEW_PARTESPIEZAS",
        descripcion: "Ver Registro de partes y piezas",
        ruta: "/dashboard/pastespiezas",
      },
      {
        nombre: "VIEW_AUDITORIA",
        descripcion: "Ver registro de auditorías",
        ruta: "/dashboard/auditoria",
      },
      {
        nombre: "VIEW_GESTIONS",
        descripcion: "Ver menú de gestioness",
        ruta: "/dashboard/gestions",
      },
      {
        nombre: "VIEW_SECUQURITYS",
        descripcion: "Ver menú de seguridad",
        ruta: "/dashboard/securitys",
      },
    ]);

    //Asignar Permisos a Roles
    await RolesPermisos.bulkCreate([
      { rol_id: 1, permiso_id: 1 },
      { rol_id: 1, permiso_id: 2 },
      { rol_id: 1, permiso_id: 3 },
      { rol_id: 1, permiso_id: 4 },
      { rol_id: 1, permiso_id: 5 },
      { rol_id: 1, permiso_id: 6 },
      { rol_id: 1, permiso_id: 7 },
      { rol_id: 1, permiso_id: 8 },
      { rol_id: 1, permiso_id: 9 },
      { rol_id: 1, permiso_id: 10 },
      { rol_id: 1, permiso_id: 11 },
      { rol_id: 1, permiso_id: 12 },
      { rol_id: 1, permiso_id: 13 },
      { rol_id: 1, permiso_id: 14 },
      { rol_id: 1, permiso_id: 15 },
      { rol_id: 1, permiso_id: 16 },
      { rol_id: 1, permiso_id: 17 },
      { rol_id: 1, permiso_id: 18 },
      { rol_id: 1, permiso_id: 19 },
      { rol_id: 1, permiso_id: 20 },
      { rol_id: 1, permiso_id: 21 },
      { rol_id: 1, permiso_id: 22 },
      { rol_id: 1, permiso_id: 23 },
      { rol_id: 1, permiso_id: 24 },
      { rol_id: 1, permiso_id: 25 },
      { rol_id: 1, permiso_id: 26 },
      { rol_id: 1, permiso_id: 27 },
      { rol_id: 1, permiso_id: 28 },
      { rol_id: 1, permiso_id: 29 },
      { rol_id: 1, permiso_id: 30 },
      { rol_id: 1, permiso_id: 31 },
      { rol_id: 1, permiso_id: 32 },
      { rol_id: 2, permiso_id: 1 },
      { rol_id: 2, permiso_id: 2 },
      { rol_id: 2, permiso_id: 3 },
      { rol_id: 2, permiso_id: 4 },
      { rol_id: 2, permiso_id: 9 },
      { rol_id: 2, permiso_id: 10 },
      { rol_id: 2, permiso_id: 11 },
      { rol_id: 2, permiso_id: 12 },
      { rol_id: 2, permiso_id: 13 },
      { rol_id: 2, permiso_id: 14 },
      { rol_id: 2, permiso_id: 15 },
      { rol_id: 2, permiso_id: 16 },
      { rol_id: 2, permiso_id: 17 },
      { rol_id: 2, permiso_id: 18 },
      { rol_id: 2, permiso_id: 19 },
      { rol_id: 2, permiso_id: 20 },
      { rol_id: 2, permiso_id: 21 },
      { rol_id: 2, permiso_id: 22 },
      { rol_id: 2, permiso_id: 23 },
      { rol_id: 2, permiso_id: 24 },
      { rol_id: 2, permiso_id: 25 },
      { rol_id: 2, permiso_id: 26 },
      { rol_id: 2, permiso_id: 27 },
      { rol_id: 2, permiso_id: 28 },
      { rol_id: 2, permiso_id: 29 },
      { rol_id: 2, permiso_id: 30 },
      { rol_id: 2, permiso_id: 31 },
      { rol_id: 2, permiso_id: 32 },
      { rol_id: 3, permiso_id: 1 },
      { rol_id: 3, permiso_id: 2 },
      { rol_id: 3, permiso_id: 25 },
      { rol_id: 3, permiso_id: 27 },
      { rol_id: 3, permiso_id: 29 },
      { rol_id: 3, permiso_id: 30 },
    ]);

    // Insertar Usuarios
    await Usuarios.bulkCreate([
      {
        username: "admin",
        email: "admin@localhost",
        password_hash:
          "$2b$12$7gjDHTrpWsOEv2ODDBnwJO02nao.DWIAO4pc1RlZ9B.AMJnpLLc1W",
        nombre: "Admin",
        apellido: "Admin",
      },
      {
        username: "operador",
        email: "operador@localhost",
        password_hash:
          "$2b$12$7gjDHTrpWsOEv2ODDBnwJO02nao.DWIAO4pc1RlZ9B.AMJnpLLc1W",
        nombre: "Operador",
        apellido: "Operador",
      },
      {
        username: "user",
        email: "user@localhost",
        password_hash:
          "$2b$12$7gjDHTrpWsOEv2ODDBnwJO02nao.DWIAO4pc1RlZ9B.AMJnpLLc1W",
        nombre: "User",
        apellido: "User",
      },
    ]);

    // Asignar Roles a Usuarios
    await UsuariosRoles.bulkCreate([
      { usuario_id: 1, rol_id: 1 },
      { usuario_id: 2, rol_id: 2 },
      { usuario_id: 3, rol_id: 3 },
    ]);

    // Insertar Áreas
    await Area.bulkCreate([
      { nombre: "Sistemas" },
      { nombre: "Administración" },
      { nombre: "Contabilidad" },
    ]);

    // Insertar Marcas
    await Marca.bulkCreate([
      { marca: "A-Data " },
      { marca: "Acer" },
      { marca: "APC" },
      { marca: "Canon" },
      { marca: "Crucial" },
      { marca: "HP" },
      { marca: "Intel" },
      { marca: "Lite-On" },
      { marca: "Logitech" },
      { marca: "Motorola" },
      { marca: "MSI" },
      { marca: "Panasonic" },
      { marca: "Seagate" },
      { marca: "Seasonic" },
      { marca: "Transcend" },
      { marca: "ViewSonic" },
      { marca: "Western Digital" },
    ]);

    // Insertar Tipos de Componentes
    await TipoComponente.bulkCreate([
      { nombre: "Disco Duro" },
      { nombre: "Fuente" },
      { nombre: "Lector CD" },
      { nombre: "Lector CD/DVD" },
      { nombre: "Memoria Ram DDR3" },
      { nombre: "Memoria Ram DDR4" },
      { nombre: "Mother Board" },
      { nombre: "Procesador" },
      { nombre: "Tarjeta de Red" },
      { nombre: "Tarjeta de Video" },
    ]);

    // Insertar Tipos de Periféricos
    await TipoPeriferico.bulkCreate([
      { nombre: "Fotocopiadora" },
      { nombre: "Impresora" },
      { nombre: "Monitor (Display)" },
      { nombre: "Raton (Mouse)" },
      { nombre: "Speaker (bosinas)" },
      { nombre: "Switch" },
      { nombre: "Teclado (Keyboard)" },
      { nombre: "UPS" },
      { nombre: "Teléfono fijo" },
      { nombre: "Teléfono movil" },
      { nombre: "Router" },
      { nombre: "Webscan" },
      { nombre: "Cámara fotográfica" },
      { nombre: "Lector de pasaporte" },
      { nombre: "Scanner" },
    ]);

    console.log("Datos iniciales insertados correctamente");
  } catch (error) {
    console.error("Error en seed:", error);
    throw error;
  } finally {
    // Cerrar la conexión específica del seed
    await sequelize.close();
  }
}

module.exports = seedData;

//seed().then(() => process.exit());
