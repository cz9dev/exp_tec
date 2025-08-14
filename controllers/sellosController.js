const PDFDocument = require("pdfkit");
const fs = require("node:fs");

const pool = require("../config/db"); // Asegúrate de tener configurado tu pool de conexiones
const SellosModel = require("../models/sellosModel");
const UserModel = require("../models/userModel");

exports.list = async (req, res) => {
  //const { search, page = 1, limit = 10 } = req.query;
  const { search, page = 1, limit = 10, fecha_inicio, fecha_fin } = req.query;
  const offset = (page - 1) * limit;

  try {
    const countResult = await SellosModel.countQuery(
      search,
      fecha_inicio,
      fecha_fin
    );
    const dataResult = await SellosModel.dataQuery(
      search,
      fecha_inicio,
      fecha_fin,
      limit,
      offset
    );

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

/**
 * Funcion para borrar sellos del registro
 */
exports.delete = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.execute("DELETE FROM dispositivo_sello WHERE id = ?", [id]);
    req.flash("success_msg", "Sello eliminado correctamente");
    res.redirect("/dashboard/sellos");
  } catch (error) {
    console.error("Error al eliminar sellos:", error);
    req.flash("error_msg", "Error al eliminar el sello");
    res.status(500).send("Error al eliminar sello");
  }
};

/**
 * Función para generar registro en pdf
 */
exports.generateRegistroSellosPdf = async (req, res) => {
  const { search, fecha_inicio, fecha_fin, page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  try {
    const countResult = await SellosModel.countQuery(
      search,
      fecha_inicio,
      fecha_fin
    );
    const dataResult = await SellosModel.dataQuery(
      search,
      fecha_inicio,
      fecha_fin,
      limit,
      offset
    );

    const total = countResult[0].total;

    if (!dataResult) {
      return res.status(404).send("Sellos no encontradas");
    }

    const doc = new PDFDocument({
      size: "LETTER",
      layout: "landscape",
      margin: 10,
    });

    const stream = doc.pipe(
      fs.createWriteStream("public/download/registro_de_sellos.pdf")
    );

    doc.rect(30, 30, doc.page.width - 60, doc.page.height - 60).stroke();

    doc.moveDown(6);
    doc
      .font("Helvetica-Bold")
      .fontSize(32)
      .text("Registro de sellos", { align: "center" }); //Poner titulo de portada

    // Poner imagen de portada de la caratula
    const imageWidth = 300;
    const imageHeight = 300;
    const centerX = (doc.page.width - imageWidth) / 2; // Cálculo para centrar
    const imageY = 180; // Ajusta según necesidad
    doc.image("public/images/registro_sellos.png", centerX, imageY, {
      width: imageWidth,
      height: imageHeight,
    });

    doc.addPage({
      layout: "landscape",
      margin: 20,
    }); // Agregar nueva página

    doc.font("Helvetica").fontSize(12);

    let tableData = [
      [
        {
          colSpan: 7,
          font: "Helvetica-Bold",
          align: { x: "center", y: "center" },
          text: "Registro de sellos",
        },
      ],
      // Fila de información general
      [        
        "Sello:",
        "Dispositivo",        
        "Fecha:",
        "Testigo:",
        "Firma:",
        "Ejecutor:",        
        "Firma:",        
      ],
    ];
    
    // Agregar filas
    dataResult.forEach((dataResult) => {
      tableData.push([
        { text: dataResult.sello, colSpan: 1 },
        { text: dataResult.dispositivo_nombre, colSpan: 1 },
        { text: dataResult.fecha_cambio, colSpan: 1 },
        { text: dataResult.trabajador_nombre, colSpan: 1 },
        { text: "", colSpan: 1 },
        { text: dataResult.usuario_nombre, colSpan: 1 },
        { text: "", colSpan: 1 },        
      ]);
    });

    tableData.push([{ colSpan: 7, text: "Nota:" }]);

    // Configuración de la tabla con anchos personalizados
    doc.table({      
      data: tableData,
    });

    doc.moveDown(); //mover abajo

    // Verificar si hay espacio suficiente para el footer
    const footerHeight = 200; // Altura estimada de tu sección de firmas
    if (!checkSpaceForFooter(doc, footerHeight)) {
      doc.addPage({ layout: "landscape" });
    }

    const userLogin = await UserModel.findById(req.session.user.id);
    const informatico = userLogin.nombre + " " + userLogin.apellido;
    doc.table({
      defaultStyle: { border: false },
      columnStyles: ["*", 4, "*"],
      data: [
        [
          { backgroundColor: "#ccc", text: "Informático" },
          "",
          { backgroundColor: "#ccc", text: "Visto Bueno" },
        ],
        [informatico, "", "________________________"],
        ["Cargo: _________________", "", "Cargo: _________________"],
        ["Fecha: _________________", "", "Fecha: _________________"],
      ],
    });

    doc.end();

    stream.on("finish", () => {
      const file = fs.createReadStream(
        "public/download/registro_de_sellos.pdf"
      );
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=registro_de_sellos.pdf"
      );
      file.pipe(res);
    });
  } catch (error) {
    console.error("Error generando PDF:", error);
    res.status(500).send("Error al generar el PDF");
  }
};

/**
 * Función para verificar el espacio disponible para agregar el pie
 * @param {*} doc
 * @param {*} requiredHeight
 * @returns
 */
function checkSpaceForFooter(doc, requiredHeight) {
  const bottomMargin = 100; // Espacio reservado para el footer
  return doc.y + requiredHeight < doc.page.height - bottomMargin;
}