const trabajadorModel = require('../models/trabajadorModel');
const areaModel = require('../models/areaModel');

module.exports = {
  list: async (req, res) => {
    try {
      const trabajadores = await trabajadorModel.findAll();
      res.render("trabajadores/list", {
        trabajadores: trabajadores,
        title: "Trabajadores",
        user: req.session.user,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al listar trabajadores");
    }
  },

  create: async (req, res) => {
    try {
      const { ci, nombres, apellidos, id_area } = req.body;
      await trabajadorModel.create(ci, nombres, apellidos, id_area);
      req.flash("success_msg", "Trabajador entrado exitosamente");
      res.redirect("/dashboard/trabajadores");
    } catch (error) {
      console.error(error);
      req.flash("error_msg", "Error al entrar el trabajador");
      res.redirect("/dashboard/trabajadores/new");
    }
  },

  edit: async (req, res) => {
    try {
      const id = req.params.id;
      const trabajador = await trabajadorModel.findById(id);
      if (!trabajador) {
        req.flash("error_msg", "Trabajador no encontrado");
        return res.redirect("/dashboard/trabajadores");
      }
      const areas = await areaModel.findAll();
      res.render("trabajadores/edit", {
        trabajador: trabajador,
        areas: areas,
        title: "Editar trabajador",
        user: req.session.user,
      });
    } catch (error) {
      console.error(error);
      req.flash("error_msg", "Error al cargar el trabajador");
      res.redirect("/dashboard/trabajadores");
    }
  },

  update: async (req, res) => {
    const id = req.params.id;
    try {
      const { ci, nombres, apellidos, id_area } = req.body;
      const updated = await trabajadorModel.update(id, ci, nombres, apellidos, id_area);
      if (updated) {
        req.flash("success_msg", "Trabajador actualizado exitosamente");
      } else {
        req.flash("error_msg", "Error al actualizar el trabajador");
      }
      res.redirect("/dashboard/trabajadores");
    } catch (error) {
      console.error(error);
      req.flash("error_msg", "Error al actualizar trabajador");
      res.redirect(`/dashboard/trabajadores/${id}/edit`);
    }
  },

  delete: async (req, res) => {
    try {
      const id = req.params.id;
      const deleted = await trabajadorModel.delete(id);
      if (deleted) {
        req.flash("success_msg", "Trabajador eliminado exitosamente");
      } else {
        req.flash("error_msg", "Error al eliminar el trabajador");
      }
      res.redirect("/dashboard/trabajadores");
    } catch (error) {
      console.error(error);
      req.flash("error_msg", "Error al eliminar trabajador");
      res.redirect("/dashboard/trabajadores");
    }
  },

  getAreas: async () => {
    try {
      const areaData = await areaModel.findAll();
      return areaData;
    } catch (error) {
      console.error("Error getting marcas:", error);
      throw error;
    }
  },
};