const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

let envConfig = {};

function loadEnv() {
  const envPath = path.resolve(__dirname, "../.env");

  try {
    if (fs.existsSync(envPath)) {
      // Leer el archivo manualmente y parsearlo
      const envFile = fs.readFileSync(envPath, { encoding: "utf8" });
      const parsed = dotenv.parse(envFile);

      // Actualizar nuestra copia y process.env
      envConfig = parsed;
      Object.assign(process.env, parsed);

      console.log("[Config] Variables de entorno recargadas");
      return true;
    }
    return false;
  } catch (error) {
    console.error("[Config] Error cargando .env:", error);
    return false;
  }
}

// Carga inicial
loadEnv();

module.exports = {
  loadEnv,
  getEnv: () => ({ ...envConfig }),
  get: (key) => envConfig[key] || process.env[key],
  // Nueva función para obtener configuración fresca
  getFresh: (key) => {
    loadEnv(); // Forzar recarga
    return envConfig[key] || process.env[key];
  },
};
