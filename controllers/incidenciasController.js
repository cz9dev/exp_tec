const pool = require('../config/db'); // Asegúrate de tener configurado tu pool de conexiones
const IncidenciaModel = require('../models/incidenciaModel');

exports.list = async (req, res) => {
  const { search, fecha_inicio, fecha_fin, page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  try {
    //const countResult = await IncidenciaModel.countQuery(search);
    //const dataResult = await IncidenciaModel.dataQuery(search, limit, offset);
    const countResult = await IncidenciaModel.countQuery(search, fecha_inicio, fecha_fin);
    const dataResult = await IncidenciaModel.dataQuery(search, fecha_inicio, fecha_fin, limit, offset);

    const total = countResult[0].total;
    res.render("incidencia/incidencias", {
      incidencias: dataResult,
      count: total,
      limit,
      page,
      search,
      fecha_inicio,
      fecha_fin,
      title: "Incidencias",
      user: req.session.user,
    });
  } catch (error) {
    console.error("Error al obtener incidencias:", error);
    res.status(500).send("Error al obtener incidencias");
  }
};

exports.delete = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.execute('DELETE FROM incidencia WHERE id = ?', [id]);
        req.flash("success_msg", "Incidencia eliminada correctamente");
        res.redirect('/dashboard/incidencias');
    } catch (error) {
        console.error('Error al eliminar incidencia:', error);
        req.flash("error_msg", "Error al eliminar la incidencia");
        res.status(500).send('Error al eliminar incidencia');
    }
};