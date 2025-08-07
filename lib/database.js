const { Sequelize } = require("sequelize");

let sequelizeInstance;

// Asegúrate de definir estas variables al inicio
let connectionAttempts = 0;
const MAX_ATTEMPTS = 3;

module.exports = {
  async connect(params) {    
    if (sequelizeInstance) {
      await this.close();
    }

    sequelizeInstance = new Sequelize(
      params.name,
      params.user,
      params.password,
      {
        host: params.host,
        dialect: params.dialect,
        logging: console.log,
        retry: {
          max: 3,
          backoffBase: 1000,
          backoffExponent: 1.5,
        },
      }
    );

    try {
      await sequelizeInstance.authenticate();
      connectionAttempts = 0;
      console.log("Conexión a DB establecida");
      return sequelizeInstance;
    } catch (error) {
      connectionAttempts++;

      if (connectionAttempts >= MAX_ATTEMPTS) {
        console.error("Máximos intentos de conexión alcanzados");
        throw error;
      }

      console.warn(
        `Intento ${connectionAttempts} de conexión fallido. Reintentando...`
      );
      await new Promise((resolve) =>
        setTimeout(resolve, 2000 * connectionAttempts)
      );
      return this.connect(params);
    }
  },

  async testConnection(config) {
    const testSequelize = new Sequelize(
      config.name,
      config.user,
      config.password,
      {
        host: config.host,
        dialect: config.dialect,
        logging: false,
        pool: {
          max: 1,
          min: 0,
          idle: 10000
        }
      }
    );
    
    try {
      await testSequelize.authenticate();
      await testSequelize.close();
      return true;
    } catch (error) {
      if (testSequelize) {
        await testSequelize.close().catch(() => {});
      }
      throw error;
    }
  },

  async close() {
    if (sequelizeInstance) {
      await sequelizeInstance.close();
      sequelizeInstance = null;
      console.log("Conexión a DB cerrada");
    }
  },

  getInstance() {
    return sequelizeInstance;
  },
};
