const PDFDocument = require("pdfkit");
const fs = require("node:fs");
const path = require("node:path");

const DeviceModel = require("../models/deviceModel");
const ComponentModel = require("../models/componentModel");
const PeripheralsModel = require("../models/peripheralsModel");
const AreaModel = require("../models/areaModel");
const TrabajadorModel = require("../models/trabajadorModel");
const DispositivoAuditoriaModel = require("../models/dispositivoAuditoriaModel");
const IncidenciaModel = require("../models/incidenciaModel");
const DispositivoSelloModel = require("../models/dispositivoSelloModel");
const UserModel = require("../models/userModel");
const { default: test } = require("node:test");

module.exports = {

  list: async (req, res) => {
    
    const { page = 1, limit = 10, search = "" } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = "";
    if (search) {
      whereClause = `WHERE d.nombre LIKE '%${search}%'`;
    }

    try {
      //const devices = await DeviceModel.findAll();
      const [devices, count] = await Promise.all([
        DeviceModel.findAllWithPagination(limit, offset, whereClause), // Nueva función del modelo
        DeviceModel.count(whereClause), // Nueva función para el conteo total
      ]);

      res.render("device/list", {
        devices,
        count,
        limit,
        page,
        search,
        currentPage: parseInt(page),
        title: "Dispositivos",
        user: req.session.user,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al listar dispositivos");
    }
  },

  showCreateForm: async (req, res) => {
    const areas = await AreaModel.findAll();
    const trabajadores = await TrabajadorModel.findAll();
    res.render("device/create", {
      areas,
      trabajadores,
      title: "Nuevo Dispositivo",
      user: req.session.user,
    });
  },

  create: async (req, res) => {
    try {
      const { tipo, inventario, nombre, ip, id_area, id_trabajador } = req.body;
      await DeviceModel.create(
        tipo,
        inventario,
        nombre,
        ip,
        id_area,
        id_trabajador
      );
      req.flash("success_msg", "Dispositivo creado con éxito");
      res.redirect("/dashboard/device");
    } catch (error) {
      console.error(error);
      req.flash("error_msg", "Error al crear dispositivo");
      res.redirect("/dashboard/device/new");
    }
  },

  showDetails: async (req, res) => {
    try {
      const id = req.params.id;
      const activeTab = req.query.tab ? req.query.tab : "components";
      const device = await DeviceModel.findById(id);
      const assignedComponents = await ComponentModel.findByDeviceId(id);
      const assignedPeripherals = await PeripheralsModel.findByDeviceId(id);
      const availableComponents = await DeviceModel.getAvailableComponents();
      const availablePeripherals = await DeviceModel.getAvailablePeripherals();

      res.render("device/details", {
        device,
        assignedComponents,
        assignedPeripherals,
        availableComponents,
        availablePeripherals,
        title: "Gestión de Dispositivo",
        user: req.session.user,
        activeTab,
      });
    } catch (error) {
      console.error(error);
      req.flash("error_msg", "Error al cargar detalles");
      res.redirect("/dashboard/device");
    }
  },

  edit: async (req, res) => {
    try {
      const { id } = req.params;
      const device = await DeviceModel.findById(id);

      if (!device) {
        req.flash("error_msg", "Dispositivo no encontrado");
        return res.redirect("/dashboard/device");
      }

      const areas = await AreaModel.findAll();
      const trabajadores = await TrabajadorModel.findAll();

      res.render("device/edit", {
        device,
        areas,
        trabajadores,
        title: "Editar Dispositivo",
        user: req.session.user,
      });
    } catch (error) {
      console.error("Error en deviceController.edit:", error);
      req.flash("error_msg", "Error al cargar el formulario de edición");
      res.redirect("/dashboard/device");
    }
  },

  update: async (req, res) => {
    try {
      const id = req.params.id;
      const device = await DeviceModel.findById(id); // obtener datos antes del cambio

      const { tipo, inventario, nombre, ip, id_area, id_trabajador } = req.body;
      const updated = await DeviceModel.update(
        id,
        tipo,
        inventario,
        nombre,
        ip,
        id_area,
        id_trabajador
      );

      // Registrar en la tabla de auditoría
      const device_despues = await DeviceModel.findById(id); // obtener datos despues del cambio
      const peripherals = await PeripheralsModel.findByDeviceId(id); // obtener datos del periferico
      await DispositivoAuditoriaModel.create(
        id,
        req.session.user.id,
        "actualizar_dispositivo",
        null,
        null,
        JSON.stringify({ device: device, peripherals: peripherals }),
        JSON.stringify({ device: device_despues, peripherals: peripherals })
      );

      if (updated) {
        req.flash("success_msg", "Dispositivo actualizado");
      } else {
        req.flash("error_msg", "Error al actualizar");
      }
      res.redirect("/dashboard/device");
    } catch (error) {
      console.error(error);
      req.flash("error_msg", "Error en el servidor");
      res.redirect(`/dashboard/device/${id}/edit`);
    }
  },

  delete: async (req, res) => {
    const { id } = req.params;
    try {
      // Verificar si tiene componentes/periféricos asignados primero
      const components = await DeviceModel.hasComponent(id);

      const peripherals = await DeviceModel.hasPeripheral(id);

      if (components[0].count > 0 || peripherals[0].count > 0) {
        req.flash(
          "error_msg",
          "No se puede eliminar: tiene componentes o periféricos asignados"
        );
        return res.redirect("/dashboard/device");
      }

      const deleted = await DeviceModel.deleteAt(id);

      if (deleted) {
        req.flash("success_msg", "Dispositivo eliminado correctamente");
      } else {
        req.flash("error_msg", "No se pudo eliminar el dispositivo");
      }

      res.redirect("/dashboard/device");
    } catch (error) {
      console.error("Error en deviceController.delete:", error);
      req.flash("error_msg", "Error al eliminar el dispositivo");
      res.redirect("/dashboard/device");
    }
  },

  // Asignar componente
  assignComponent: async (req, res) => {
    const { id } = req.params;
    try {
      const { componentId } = req.body;
      const device = await DeviceModel.findById(id); // obtener datos antes del cambio
      const component = await ComponentModel.findByDeviceId(id); // obtener datos del componente

      await DeviceModel.assignComponent(id, componentId);

      // Registrar en la tabla de auditoría
      const component_despues = await ComponentModel.findByDeviceId(id); // obtener datos del componente despues
      await DispositivoAuditoriaModel.create(
        id,
        req.session.user.id,
        "asignar_componente",
        componentId,
        null,
        JSON.stringify({ device: device, component: component }),
        JSON.stringify({ device: device, component: component_despues })
      );

      req.flash("success_msg", "Componente asignado correctamente");
    } catch (error) {
      console.error(error);
      req.flash("error_msg", "Error al asignar componente");
    }
    res.redirect(`/dashboard/device/${id}?tab=components`);
  },

  // Desasignar componente
  unassignComponent: async (req, res) => {
    const { id, componentId } = req.params;
    try {
      const device = await DeviceModel.findById(id); // obtener datos antes del cambio
      const component = await ComponentModel.findByDeviceId(id); // obtener datos del componente

      const success = await DeviceModel.unassignComponent(id, componentId);

      // Registrar en la tabla de auditoría
      const component_despues = await ComponentModel.findByDeviceId(id); // obtener datos del componente despues
      await DispositivoAuditoriaModel.create(
        id,
        req.session.user.id,
        "desasignar_componente",
        componentId,
        null,
        JSON.stringify({ device: device, component: component }),
        JSON.stringify({ device: device, component: component_despues })
      );

      if (success) {
        req.flash("success_msg", "Componente desasignado");
      } else {
        req.flash("error_msg", "Error al desasignar componente");
      }
    } catch (error) {
      console.error(error);
      req.flash("error_msg", "Error al desasignar");
    }
    res.redirect(`/dashboard/device/${id}?tab=components`);
  },

  // Asignar periférico
  assignPeripheral: async (req, res) => {
    const { id } = req.params;
    try {
      const device = await DeviceModel.findById(id); // obtener datos antes del cambio
      const peripherals = await PeripheralsModel.findByDeviceId(id); // obtener datos del periferico

      const { peripheralId } = req.body;
      const success = await DeviceModel.assignPeripheral(id, peripheralId);

      // Registrar en la tabla de auditoría
      const peripherals_despues = await PeripheralsModel.findByDeviceId(id); // obtener datos del periferico despues
      await DispositivoAuditoriaModel.create(
        id,
        req.session.user.id,
        "asignar_periferico",
        null,
        peripheralId,
        JSON.stringify({ device: device, peripherals: peripherals }),
        JSON.stringify({ device: device, peripherals: peripherals_despues })
      );

      if (success) {
        req.flash("success_msg", "Periférico asignado correctamente");
      } else {
        req.flash("error_msg", "Error al asignar periférico");
      }
    } catch (error) {
      console.error(error);
      req.flash("error_msg", "Error en el servidor");
    }
    res.redirect(`/dashboard/device/${id}?tab=peripherals`);
  },

  // Desasignar periférico
  unassignPeripheral: async (req, res) => {
    const { id, peripheralId } = req.params;
    try {
      const device = await DeviceModel.findById(id); // obtener datos antes del cambio
      const peripherals = await PeripheralsModel.findByDeviceId(id); // obtener datos del periferico

      const success = await DeviceModel.unassignPeripheral(id, peripheralId);

      // Registrar en la tabla de auditoría
      const peripherals_despues = await PeripheralsModel.findByDeviceId(id); // obtener datos del periferico despues
      await DispositivoAuditoriaModel.create(
        id,
        req.session.user.id,
        "desasignar_periferico",
        null,
        peripheralId,
        JSON.stringify({ device: device, peripherals: peripherals }),
        JSON.stringify({ device: device, peripherals: peripherals_despues })
      );

      if (success) {
        req.flash("success_msg", "Periférico desasignado");
      } else {
        req.flash("error_msg", "Error al desasignar");
      }
    } catch (error) {
      console.error(error);
      req.flash("error_msg", "Error en el servidor");
    }
    res.redirect(`/dashboard/device/${id}?tab=peripherals`);
  },

  showIncidenciaForm: async (req, res) => {
    try {
      const deviceId = req.params.id;
      const device = await DeviceModel.findById(deviceId);
      const trabajadores = await TrabajadorModel.findAll(); // Obtener lista de trabajadores

      if (!device) {
        req.flash("error_msg", "Dispositivo no encontrado");
        return res.redirect("/dashboard/device");
      }

      res.render("device/incidencia", {
        device,
        trabajadores,
        title: "Registrar Incidencia",
        user: req.session.user,
      });
    } catch (error) {
      console.error("Error en showIncidenciaForm:", error);
      req.flash("error_msg", "Error al cargar el formulario de incidencia");
      res.redirect("/dashboard/device");
    }
  },

  createIncidencia: async (req, res) => {
    try {
      const {
        id_dispositivo,
        tipo_incidencia,
        descripcion,
        id_trabajador,
        resuelto,
        conforme,
        fecha_incidencia,
        sello,
      } = req.body;

      const id_usuario = req.session.user.id; // Obtén el ID del usuario de la sesión

      // Convertir a booleanos
      const resueltoBool = resuelto === "on";
      const conformeBool = conforme === "on";

      const success_incidencia = await IncidenciaModel.create(
        id_dispositivo,
        tipo_incidencia,
        fecha_incidencia,
        descripcion,
        id_usuario,
        resueltoBool || false, // Si no se especifica, resuelto es false
        id_trabajador === "" ? null : parseInt(id_trabajador, 10),
        conformeBool
      );
      if (
        sello &&
        (tipo_incidencia === "hardware" || tipo_incidencia === "mantenimiento")
      ) {
        const success_sello = await DispositivoSelloModel.create(
          sello,
          id_dispositivo,
          fecha_incidencia,
          id_trabajador === "" ? null : parseInt(id_trabajador, 10),
          id_usuario
        );
        if (!success_sello) {
          req.flash("error_msg", "Error al registrar el sello");
        }
      }

      if (success_incidencia) {
        req.flash("success_msg", "Registro de incidencia correctamente");
      } else {
        req.flash("error_msg", "Error al registrar la incidencia");
      }

      res.redirect(`/dashboard/device`);
    } catch (error) {
      console.error("Error en createIncidencia:", error);
      req.flash("error_msg", "Error al crear la incidencia");
      res.redirect(`/dashboard/device/${req.body.id_dispositivo}/incidencia`);
    }
  },

  generateExpTecnicoPdf: async (req, res) => {
    try {
      const deviceId = req.params.id;
      const device = await DeviceModel.findById(deviceId);
      const component = await ComponentModel.findByDeviceId(deviceId);
      const periferico = await PeripheralsModel.findByDeviceId(deviceId);

      if (!device) {
        return res.status(404).send("Dispositivo no encontrado");
      }

      const doc = new PDFDocument({ size: "LETTER" });
      const stream = doc.pipe(
        fs.createWriteStream("public/download/exp_tecnico.pdf")
      );

      doc.rect(30, 30, doc.page.width - 60, doc.page.height - 60).stroke();

      doc.moveDown(2);
      doc
        .font("Helvetica-Bold")
        .fontSize(28)
        .text("Expediente Técnico", { align: "center" }); //Poner titulo de portada
      //doc.moveDown(4); //mover abajo
      // Poner imagen de portada de la caratula
      const imageWidth = 300;
      const imageHeight = 300;
      const centerX = (doc.page.width - imageWidth) / 2; // Cálculo para centrar
      const imageY = 250; // Ajusta según necesidad
      doc.image("public/images/pc.png", centerX, imageY, {
        width: imageWidth,
        height: imageHeight,
      });

      doc.moveDown(16); //mover abajo
      doc
        .fontSize(18)
        .text(`Dispositivo: ${device.nombre}`, { align: "center" }); // Poner el nombre del dispositivo

      doc.addPage({
        layout: "landscape",
        margin: 20,
      }); // Agregar nueva página

      doc.font("Helvetica").fontSize(12);

      let tableData = [
        [
          "",
          {
            colSpan: 5,
            font: "Helvetica-Bold",
            align: { x: "center", y: "center" },
            text: "EXPEDIENTE TÉCNICO DE DISPOSITIVO",
          },
        ],
        // Fila de información general
        [
          "Empresa:",
          { test: "", colSpan: 1 },
          "Responsable:",
          device.trabajador,
          "Área:",
          device.area,
        ],
        [
          "IP de dispositivo:",
          { text: device.ip, colSpan: 1 },
          "Nombre del dispositivo:",
          device.nombre,
          "Inventario:",
          device.inventario,
        ],
        ["Tipo:", { text: device.tipo, colSpan: 5 }],
        // Encabezado de componentes (4 columnas pero ocupa 6 con colSpan)
        [
          {
            colSpan: 6,
            backgroundColor: "#ccc",
            font: "Helvetica-Bold",
            align: { x: "center", y: "center" },
            text: "DETALLES DE COMPONENTES",
          },
        ],
        // Fila de encabezado para componentes (4 columnas distribuidas en 6)
        [
          { text: "Componente", colSpan: 1, width: 120 },
          { text: "Marca", colSpan: 1, width: 100 },
          { text: "Modelo", colSpan: 2, width: 150 },
          { text: "Número de serie", colSpan: 2, width: 150 },
        ],
      ];

      // Agregar filas para componentes
      component.forEach((comp) => {
        tableData.push([
          { text: comp.tipo_componente, colSpan: 1 },
          { text: comp.marca, colSpan: 1 },
          { text: comp.modelo, colSpan: 2 },
          { text: comp.numero_serie, colSpan: 2 },
        ]);
      });

      // Encabezado de perifericos (5 columnas distribuidas en 6)
      tableData.push([
        {
          colSpan: 6,
          font: "Helvetica-Bold",
          backgroundColor: "#ccc",
          align: { x: "center", y: "center" },
          text: "DETALLES DE PERIFÉRICOS",
        },
      ]);

      // Fila de encazado para perifericos (5 columnas distribuidas en 6)
      tableData.push([
        { text: "Periférico", colSpan: 1 },
        { text: "Marca", colSpan: 1 },
        { text: "Modelo", colSpan: 1 },
        { text: "Número de serie", colSpan: 2 },
        { text: "Inventario", colSpan: 1 },
      ]);

      // Agregar filas para periféricos
      periferico.forEach((perif) => {
        tableData.push([
          { text: perif.tipo_periferico, colSpan: 1 },
          { text: perif.marca, colSpan: 1 },
          { text: perif.modelo, colSpan: 1 },
          { text: perif.numero_serie, colSpan: 2 },
          { text: perif.inventario, colSpan: 1 },
        ]);
      });

      // Configuración de la tabla con anchos personalizados
      doc.table({
        data: tableData,
        columnStyles: {
          0: { width: 100 }, // Ancho columna 1
          1: { width: 80 }, // Ancho columna 2
          2: { width: 80 }, // Ancho columna 3
          3: { width: 100 }, // Ancho columna 4
          4: { width: 120 }, // Ancho columna 5
          5: { width: 80 }, // Ancho columna 6
        },
        padding: 5,
      });

      doc.moveDown(); //mover abajo

      // Verificar si hay espacio suficiente para el footer
      const footerHeight = 200; // Altura estimada de tu sección de firmas
      if (!checkSpaceForFooter(doc, footerHeight)) {
        doc.addPage({ layout: "landscape" });
      }

      // Terminos y condiciones para firmante
      doc.font("Helvetica-Bold").fontSize(14).text("TÉRMINOS Y CONDICIONES", {
        align: "left",
        underline: true,
      });

      doc.moveDown(0.5);
      doc
        .font("Helvetica")
        .fontSize(11)
        .text("El responsable declara aceptar los siguientes términos:", {
          align: "left",
        });

      doc.moveDown(0.5);
      doc.fontSize(11).text("1. Custodia y Uso Adecuado:", {
        align: "left",
        indent: 20,
      });
      doc.text(
        "   • Se compromete a utilizar los materiales exclusivamente para fines laborales autorizados.",
        {
          indent: 40,
        }
      );
      doc.text(
        "   • Mantendrá los bienes en condiciones óptimas, evitando daños por mal uso o negligencia.",
        {
          indent: 40,
        }
      );

      doc.moveDown(0.5);
      doc.text("2. Prohibiciones:", {
        indent: 20,
      });
      doc.text(
        "   • No transferir los materiales a terceros sin autorización escrita.",
        {
          indent: 40,
        }
      );
      doc.text("   • No desarmar, modificar o reparar los componentes.", {
        indent: 40,
      });

      doc.moveDown(0.5);
      doc.text("3. Devolución:", {
        indent: 20,
      });
      doc.text(
        "   • En caso de reubicación, terminación laboral o solicitud expresa, devolverá los materiales en el mismo estado (considerando desgaste normal).",
        {
          indent: 40,
        }
      );

      doc.moveDown(0.5);
      doc.text("4. Pérdida o Daño:", {
        indent: 20,
      });
      doc.text(
        "   • Reportar inmediatamente cualquier anomalía. Los costos por pérdida o daño atribuible a negligencia serán asumidos por el responsable.",
        {
          indent: 40,
        }
      );

      // --- SECCIÓN CONFORMIDAD ---
      doc.moveDown(1.5);
      doc.font("Helvetica-Bold").fontSize(14).text("CONFORMIDAD", {
        align: "left",
        underline: true,
      });

      doc.moveDown(0.5);
      doc
        .font("Helvetica")
        .fontSize(11)
        .text(
          "El abajo responsable firmante acepta los términos y reconoce haber recibido los materiales descritos:",
          {
            align: "left",
          }
        );

      doc.moveDown(4); // Espacio antes de firmas

      const userLogin = await UserModel.findById(req.session.user.id);
      const informatico = userLogin.nombre + " " + userLogin.apellido;
      doc.table({
        defaultStyle: { border: false },
        columnStyles: [54, "*", 46, 54, 10, 54, "*", 46, 54],
        data: [
          [
            { colSpan: 4, backgroundColor: "#ccc", text: "Responsable" },
            "",
            { colSpan: 4, backgroundColor: "#ccc", text: "Informático" },
          ],
          [
            "Nombre:",
            device.trabajador,
            "Firma:",
            "_______",
            "",
            "Nombre:",
            informatico,
            "Firma:",
            "_______",
          ],
          [
            "Cargo:",
            "_______________________",
            "fecha:",
            "_______",
            "",
            "Cargo:",
            "_______________________",
            "fecha:",
            "_______",
          ],
          [{ colSpan: 4, backgroundColor: "#ccc", text: "Jefe inmediato" }],
          ["Nombre:", "_______________________", "Firma:", "_______"],
          ["Cargo:", "_______________________", "fecha:", "_______"],
        ],
      });

      doc.end();

      stream.on("finish", () => {
        const file = fs.createReadStream("public/download/exp_tecnico.pdf");
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
          "Content-Disposition",
          "attachment; filename=exp_tecnico.pdf"
        );
        file.pipe(res);
      });
    } catch (error) {
      console.error("Error generando PDF:", error);
      res.status(500).send("Error al generar el PDF");
    }
  },
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
