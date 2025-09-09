const { loadEnv, getEnv, get, getFresh } = require("./envLoader");

module.exports = {
  // Métodos para acceso a configuraciones
  env: get,
  getAll: getEnv,
  reload: loadEnv,

  // Configuraciones específicas
  database: {
    host: get("DB_HOST") || "localhost",
    user: get("DB_USER") || "root",
    password: get("DB_PASS") || "", // Asegúrate de que esto no sea undefined
    name: get("DB_NAME") || "exp_tec", // Cambiado a tu nombre de DB por defecto
    dialect: get("DB_DIALECT") || "mysql",
  },

  session: {
    secret: get("SESSION_SECRET") || "default-secret",
    cookie: {
      secure: get("SESSION_SECURE") === "true",
    },
  },

  development: {
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "",
    database: process.env.DB_NAME || "exp_tec",
    host: process.env.DB_HOST || "localhost",
    dialect: process.env.DB_DIALECT || "mysql",
    logging: console.log, // Opcional: muestra las consultas SQL en la consola
  },
  test: {
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "",
    database: process.env.DB_NAME || "exp_tec_test",
    host: process.env.DB_HOST || "localhost",
    dialect: process.env.DB_DIALECT || "mysql",
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || "mysql",
    logging: false, // Desactiva logs en producción
  },

  freshDatabase: {
    get host() {
      return getFresh("DB_HOST") || "localhost";
    },
    get user() {
      return getFresh("DB_USER") || "root";
    },
    get password() {
      return getFresh("DB_PASS") || "";
    },
    get name() {
      return getFresh("DB_NAME") || "exp_tec";
    },
    get dialect() {
      return getFresh("DB_DIALECT") || "mysql";
    },
  },
};
