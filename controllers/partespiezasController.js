const PDFDocument = require("pdfkit");
const fs = require("node:fs");
const path = require("node:path");

const PartespiezasModel = require("../models/partespiezasModel");
const UserModel = require("../models/userModel");

exports.list = async (req, res) => {
  const { search, page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  try {
    const count = await PartespiezasModel.count(search);
    const partespiesas = await PartespiezasModel.findAll(search, limit, offset);
    res.render("partespiezas/partespiezas", {
      partespiesas,
      count,
      limit,
      page,
      search,
      title: "Registro de partes y piezas",
      user: req.session.user,
    });
  } catch (error) {
    console.error("Error al obtener partes y piezas:", error);
    res.status(500).send("Error al obtener partes y piezas");
  }
};

exports.generatePartesPiezasPdf = async (req, res) => {
  const { search, page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;
  try {
    const partespiesas = await PartespiezasModel.findAll(search, limit, offset);

    if (!partespiesas) {
      return res.status(404).send("Partes y piezas no encontradas");
    }

    const doc = new PDFDocument({
      size: "LETTER",
      layout: "landscape",
      margin: 20,
    });

    const stream = doc.pipe(
      fs.createWriteStream("public/download/registro_partes_piezas.pdf")
    );

    doc.rect(30, 30, doc.page.width - 60, doc.page.height - 60).stroke();

    doc.moveDown(6);
    doc
      .font("Helvetica-Bold")
      .fontSize(32)
      .text("Registro de partes y piezas", { align: "center" }); //Poner titulo de portada

    // Poner imagen de portada de la caratula
    const imageWidth = 300;
    const imageHeight = 300;
    const centerX = (doc.page.width - imageWidth) / 2; // Cálculo para centrar
    const imageY = 180; // Ajusta según necesidad
    doc.image("public/images/partes-piezas.png", centerX, imageY, {
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
          colSpan: 4,
          font: "Helvetica-Bold",
          align: { x: "center", y: "center" },
          text: "LISTADO DE PARTES Y PIEZAS",
        },
      ],
      // Fila de información general
      ["Partes o piezas:", "Marca:", "Modelo:", "No. Serie (Sí procede)"],
    ];

    // Agregar filas
    partespiesas.forEach((comp) => {
      tableData.push([
        { text: comp.tipo_componente_nombre, colSpan: 1 },
        { text: comp.marca_nombre, colSpan: 1 },
        { text: comp.modelo, colSpan: 1 },
        { text: comp.numero_serie, colSpan: 1 },
      ]);
    });

    tableData.push([{ colSpan: 4, text: "Nota:" }]);

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
        ["________________________", "", informatico],
        ["Cargo: _________________", "", "Cargo: _________________"],
        ["Fecha: _________________", "", "Fecha: _________________"],
      ],
    });

    doc.end();

    stream.on("finish", () => {
      const file = fs.createReadStream(
        "public/download/registro_partes_piezas.pdf"
      );
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=registro_partes_piezas.pdf"
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
