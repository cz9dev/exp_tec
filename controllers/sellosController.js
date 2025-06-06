const pool = require('../config/db'); // Asegúrate de tener configurado tu pool de conexiones
const sellosModel = require('../models/sellosModel');

exports.list = async (req, res) => {
  //const { search, page = 1, limit = 10 } = req.query;
  const { search, page = 1, limit = 10, fecha_inicio, fecha_fin } = req.query;
  const offset = (page - 1) * limit;

  try {
    //const countResult = await sellosModel.countQuery(search);
    //const dataResult = await sellosModel.dataQuery(search, limit, offset);
    const countResult = await sellosModel.countQuery(search, fecha_inicio, fecha_fin);
    const dataResult = await sellosModel.dataQuery(search, fecha_inicio, fecha_fin, limit, offset);

    const total = countResult[0].total;
    res.render("sellos/sellos", {
      sellos: dataResult,
      count: total,
      limit,
      page,
      search,
      fecha_inicio,
      fecha_fin,
      title: "Sellos",
      user: req.session.user,
    });
  } catch (error) {
    console.error("Error al obtener sellos:", error);
    res.status(500).send("Error al obtener sellos");
  }
};

exports.delete = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.execute('DELETE FROM dispositivo_sello WHERE id = ?', [id]);
        req.flash("success_msg", "Sello eliminado correctamente");
        res.redirect('/dashboard/sellos');
    } catch (error) {
        console.error('Error al eliminar sellos:', error);
        req.flash("error_msg", "Error al eliminar el sello");
        res.status(500).send('Error al eliminar sello');
    }
};