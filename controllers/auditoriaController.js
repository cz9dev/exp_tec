const moment = require("moment");

const AuditoriaModel = require("../models/auditoriaModel");
const UsuarioModel = require("../models/userModel");
const DispositivoModel = require("../models/deviceModel");

exports.list = async (req, res) => {
  const {
    search,
    page = 1,
    limit = 10,
    fecha_inicio,
    fecha_fin,
    dispositivo_id,
    usuario_id,
  } = req.query;
  const offset = (page - 1) * limit;

  try {
    const count = await AuditoriaModel.countQuery(
      search,
      fecha_inicio,
      fecha_fin,
      dispositivo_id,
      usuario_id
    );
    const auditorias = await AuditoriaModel.dataQuery(
      search,
      fecha_inicio,
      fecha_fin,
      limit,
      offset,
      dispositivo_id,
      usuario_id
    );
    const dispositivos = await DispositivoModel.findAll(); //Obtener todos los dispositivos
    const usuarios = await UsuarioModel.findAll(); //Obtener todos los usuarios

    const formattedData = auditorias.map((auditoria) => ({
      ...auditoria,
      fecha_hora: moment(auditoria.fecha_hora, "DD/MM/YYYY hh:mm:ss A").format(
        "DD/MM/YYYY hh:mm:ss A"
      ),
      datos_antes_truncate: truncateString(auditoria.datos_antes, 50), // Trunca a 50 caracteres
      datos_despues_truncate: truncateString(auditoria.datos_despues, 50), // Trunca a 50 caracteres
    }));

    res.render("auditoria/auditoria", {
      auditorias: formattedData,
      count,
      limit,
      page,
      search,
      fecha_inicio,
      fecha_fin,
      dispositivo_id,
      usuario_id,
      title: "Auditoría de Dispositivos",
      user: req.session.user,
      dispositivos,
      usuarios,
    });
  } catch (error) {
    console.error("Error al obtener auditorias:", error);
    res.status(500).send("Error al obtener auditorias");
  }
};

exports.pdf = async (req, res) => {
  // Aquí deberías implementar la lógica para generar el PDF
  // Puedes usar librería pdfkid que ya se utiliza en otros módulos
  res.send("Generando PDF..."); // Reemplazar con la generación real del PDF.
};

function truncateString(str, maxLength) {
  return str.length > maxLength ? str.substring(0, maxLength) + "..." : str;
}
