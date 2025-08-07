module.exports = async function (req, res, next) {
  if (!req.app.locals.db) {
    return next();
  }

  try {
    // Verificar si la conexión está activa
    await req.app.locals.db.getInstance().authenticate();
    next();
  } catch (error) {
    console.error("Verificación de conexión fallida:", error);

    if (error.original && error.original.code === "PROTOCOL_CONNECTION_LOST") {
      try {
        // Intentar reconectar
        await req.app.locals.db.connect(config.database);
        next();
      } catch (reconnectError) {
        res.status(503).render("errors/db-down", {
          error: reconnectError,
          layout: false,
        });
      }
    } else {
      res.status(503).render("errors/db-down", {
        error: error,
        layout: false,
      });
    }
  }
};
