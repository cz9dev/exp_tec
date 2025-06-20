const pool = require("../config/db");
const { checkAuth } = require("../middleware/auth");

const dashboardController = {
  showDashboard: async (req, res) => {
    try {
      // Obtener datos para los widgets
      const [incidencias] = await pool.execute(
        `SELECT DATE(fecha_incidencia) as dia, COUNT(*) as total 
             FROM incidencia 
             WHERE fecha_incidencia >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
             GROUP BY DATE(fecha_incidencia) 
             ORDER BY dia ASC`
      );

      // Formatear los datos correctamente
      const incidenciasFormateadas = incidencias.map((item) => ({
        dia: new Date(item.dia).toISOString().split("T")[0], // Formato YYYY-MM-DD
        total: item.total,
      }));

      // Completar días faltantes con total 0
      const ultimos7Dias = [];
      for (let i = 6; i >= 0; i--) {
        const fecha = new Date();
        fecha.setDate(fecha.getDate() - i);
        const fechaStr = fecha.toISOString().split("T")[0];

        const existe = incidenciasFormateadas.find(
          (item) => item.dia === fechaStr
        );
        ultimos7Dias.push({
          dia: fechaStr,
          total: existe ? existe.total : 0,
        });
      }

      console.log("Datos de incidencias:", ultimos7Dias);

      const [dispositivos] = await pool.execute(
        `SELECT COUNT(*) as total FROM dispositivo WHERE estado = 'activo'`
      );

      const [trabajadores] = await pool.execute(
        `SELECT COUNT(*) as total FROM trabajadores`
      );

      // Obtener datos de periféricos por tipo
      const [perifericosPorTipo] = await pool.execute(
        `SELECT tp.nombre as tipo, COUNT(p.id) as cantidad
         FROM periferico p
         JOIN tipo_periferico tp ON p.id_tipo_periferico = tp.id
         GROUP BY tp.nombre
         ORDER BY cantidad DESC`
      );

      // Formatear datos perifericos por tipos para el gráfico
      const perifericosData = perifericosPorTipo.map((item) => ({
        tipo: item.tipo,
        cantidad: item.cantidad,
      }));

      // Obtener datos de dispositivos por tipo
      const [dispositivosPorTipo] = await pool.execute(
        `SELECT d.tipo, COUNT(d.id) as cantidad
         FROM dispositivo d
         WHERE deleted_at IS NULL
         GROUP BY d.tipo
         ORDER BY cantidad DESC`
      );

      // Formatear datos perifericos por tipos para el gráfico
      const dispositivosData = dispositivosPorTipo.map((item) => ({
        tipo: item.tipo,
        cantidad: item.cantidad,
      }));

      // Usar preferencias guardadas o valores por defecto
      const widgetPreferences = req.widgetPreferences || {
        incidencias: true,
        dispositivos: true,
        trabajadores: true,
        perifericos: true,
        dispositivosTipo: true,
      };

      res.render("dashboard", {
        title: "Dashboard",
        user: req.session.user,
        widgets: {
          incidencias: {
            data: ultimos7Dias,
            enabled: widgetPreferences.incidencias,
          },
          dispositivos: {
            total: dispositivos[0]?.total || 0,
            enabled: widgetPreferences.dispositivos,
          },
          trabajadores: {
            total: trabajadores[0]?.total || 0,
            enabled: widgetPreferences.trabajadores,
          },
          perifericos: {
            data: perifericosData,
            enabled: widgetPreferences.perifericos,
          },
          dispositivosPorTipo: {
            data: dispositivosData,
            enabled: widgetPreferences.dispositivosPorTipo,
          },
        },
      });
    } catch (error) {
      console.error(error);
      res.redirect("/login");
    }
  },

  loadWidgetPreferences: async (req, res, next) => {
    try {
      if (!req.session.user?.id) return next();

      const [rows] = await pool.execute(
        "SELECT widgets FROM usuarios_widgets WHERE usuarios_id = ?",
        [req.session.user.id]
      );

      if (rows.length > 0) {
        req.widgetPreferences = JSON.parse(rows[0].widgets);
      }

      next();
    } catch (error) {
      console.error("Error al cargar preferencias:", error);
      next();
    }
  },

  saveWidgetPreferences: async (req, res) => {
    try {
      const { widgets } = req.body;
      // Aquí guardarías las preferencias en la base de datos
      // Ejemplo:
      await pool.execute(
        `INSERT INTO usuarios_widgets (usuarios_id, widgets) 
         VALUES (?, ?) 
         ON DUPLICATE KEY UPDATE widgets = VALUES(widgets)`,
        [req.session.user.id, JSON.stringify(widgets)]
      );

      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false });
    }
  },
};

module.exports = dashboardController;
