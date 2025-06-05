const pool = require('../config/db'); // Asegúrate de tener configurado tu pool de conexiones

exports.list = async (req, res) => {
  const { search, page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  let whereClause = "";
  let params = [];

  if (search) {
    whereClause = `WHERE tipo_incidencia LIKE ? OR descripcion LIKE ?`; // Ajusta los campos según tu tabla
    params = [`%${search}%`, `%${search}%`];
  }

  const countQuery = `SELECT COUNT(*) AS total FROM incidencia ${whereClause}`; // Corregido: incidencia (singular)
  const dataQuery = `
  SELECT 
    i.*, 
    d.nombre AS dispositivo_nombre, 
    u.nombre AS usuario_nombre, 
    t.nombres AS trabajador_nombre 
  FROM 
    incidencia i
  LEFT JOIN 
    dispositivo d ON i.id_dispositivo = d.id
  LEFT JOIN 
    usuarios u ON i.id_usuario = u.id
  LEFT JOIN 
    trabajadores t ON i.id_trabajador = t.id
  ${whereClause} 
  LIMIT ${limit} OFFSET ${offset}
`;

  try {
    const [countResult] = await pool.execute(countQuery, params);
    const [dataResult] = await pool.execute(dataQuery, params);

    const total = countResult[0].total;
    res.render("incidencia/incidencias", {
      incidencias: dataResult,
      count: total,
      limit,
      page,
      search,
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
        res.redirect('/dashboard/incidencias');
    } catch (error) {
        console.error('Error al eliminar incidencia:', error);
        res.status(500).send('Error al eliminar incidencia');
    }
};