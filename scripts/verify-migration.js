const { Sequelize } = require("sequelize");
const { Dispositivo, Trabajadores } = require("../models/index");

async function verifyMigration() {
  try {
    // Verificar que la relación funciona
    const dispositivo = await Dispositivo.findOne({
      include: [
        {
          model: Trabajadores,
          as: "trabajadores",
          required: false,
        },
      ],
    });

    console.log("✅ Migración verificada correctamente");
    console.log("Dispositivo con trabajador:", dispositivo?.trabajador);
  } catch (error) {
    console.error("❌ Error en la verificación:", error.message);
    process.exit(1);
  } finally {
    await Sequelize.close();
  }
}

verifyMigration();
