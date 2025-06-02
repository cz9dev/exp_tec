const DeviceModel = require("../models/deviceModel");
const ComponentModel = require("../models/componentModel");
const PeripheralsModel = require("../models/peripheralsModel");
const AreaModel = require("../models/areaModel");
const TrabajadorModel = require("../models/trabajadorModel");

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
      const [components] = await pool.execute(
        "SELECT COUNT(*) AS count FROM dispositivo_componente WHERE id = ?",
        [id]
      );

      const [peripherals] = await pool.execute(
        "SELECT COUNT(*) AS count FROM dispositivo_periferico WHERE id = ?",
        [id]
      );

      if (components[0].count > 0 || peripherals[0].count > 0) {
        req.flash(
          "error_msg",
          "No se puede eliminar: tiene componentes o periféricos asignados"
        );
        return res.redirect("/dashboard/device");
      }

      const deleted = await DeviceModel.delete(id);

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
    try {
      const { id } = req.params;
      const { componentId } = req.body;
      await DeviceModel.addComponent(id, componentId);
      req.flash("success_msg", "Componente asignado correctamente");
    } catch (error) {
      console.error(error);
      req.flash("error_msg", "Error al asignar componente");
    }
    res.redirect(`/dashboard/device/${id}`);
  },

  // Desasignar componente
  unassignComponent: async (req, res) => {
    try {
      const { id, componentId } = req.params;
      await pool.execute(
        "DELETE FROM dispositivo_componente WHERE id_dispositivo = ? AND id_componente = ?",
        [id, componentId]
      );
      req.flash("success_msg", "Componente desasignado");
    } catch (error) {
      console.error(error);
      req.flash("error_msg", "Error al desasignar");
    }
    res.redirect(`/dashboard/device/${id}`);
  },

  // Asignar periférico
  assignPeripheral: async (req, res) => {
    try {
      const { id } = req.params;
      const { peripheralId } = req.body;

      const success = await DeviceModel.assignPeripheral(
        id,
        peripheralId
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
    res.redirect(`/dashboard/device/${id}`);
  },

  // Desasignar periférico
  unassignPeripheral: async (req, res) => {
    try {
      const { id, idPeriferico } = req.params;

      const success = await DeviceModel.unassignPeripheral(id, idPeriferico);
      if (success) {
        req.flash("success_msg", "Periférico desasignado");
      } else {
        req.flash("error_msg", "Error al desasignar");
      }
    } catch (error) {
      console.error(error);
      req.flash("error_msg", "Error en el servidor");
    }
    res.redirect(`/dashboard/device/${id}`);
  },
};
