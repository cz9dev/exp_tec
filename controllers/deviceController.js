const DeviceModel = require("../models/deviceModel");
const ComponentModel = require("../models/componentModel");
const PeripheralsModel = require("../models/peripheralsModel");
const AreaModel = require("../models/areaModel");
const TrabajadorModel = require("../models/trabajadorModel");
const DispositivoAuditoriaModel = require("../models/dispositivoAuditoriaModel");
const IncidenciaModel = require("../models/incidenciaModel");
const DispositivoSelloModel = require("../models/dispositivoSelloModel");

module.exports = {
  list: async (req, res) => {
    try {
      const devices = await DeviceModel.findAll();
      res.render("device/list", {
        devices,
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
};
