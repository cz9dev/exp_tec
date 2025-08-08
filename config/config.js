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
