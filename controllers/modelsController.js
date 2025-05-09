const modelos = require('../models/modelsModel');
const marcasModel = require('../models/brandModel');

module.exports = {
  //Listar modelos
  list: async (req, res) => {
    try {
      const models = await modelos.findAll();
      res.render("models/list", {
        models: models,
        title: "Modelos",
        user: req.session.user,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al listar los modelos");
    }
  },

  create: async (req, res) => {
    try {
      const { id_marca, modelo } = req.body;
      await modelos.create(id_marca, modelo);
      req.flash("success_msg", "Modelo creado exitosamente");
      res.redirect("/dashboard/models");
    } catch (error) {
      console.error(error);
      req.flash("error_msg", "Error al crear modelo");
      res.redirect("/dashboard/models/new"); // Redirect back to form
    }
  },

  edit: async (req, res) => {
    try {
      const id = req.params.id;
      const modelo = await modelos.findById(id);
      if (!modelo) {
        req.flash("error_msg", "Modelo no encontrado");
        return res.redirect("/dashboard/models");
      }
      const marcas = await marcasModel.findAll(); 
      res.render("models/edit", {
        modelo,
        marcas,
        title: "Editar Modelo",
        user: req.session.user,        
      });
    } catch (error) {
      console.error(error);
      req.flash("error_msg", "Error al cargar modelo");
      res.redirect("/dashboard/models");
    }
  },

  update: async (req, res) => {
    try {
      const id = req.params.id;
      const { id_marca, modelo } = req.body;
      const updated = await modelos.update(id, id_marca, modelo);
      if (updated) {
        req.flash("success_msg", "Modelo actualizado exitosamente");
      } else {
        req.flash("error_msg", "Error al actualizar modelo");
      }
      res.redirect("/dashboard/models");
    } catch (error) {
      console.error(error);
      req.flash("error_msg", "Error al actualizar modelo");
      res.redirect(`/dashboard/models/${id}/edit`);
    }
  },

  delete: async (req, res) => {
    try {
      const id = req.params.id;
      const deleted = await modelos.delete(id);
      if (deleted) {
        req.flash("success_msg", "Modelo eliminado exitosamente");
      } else {
        req.flash("error_msg", "Error al eliminar modelo");
      }
      res.redirect("/dashboard/models");
    } catch (error) {
      console.error(error);
      req.flash("error_msg", "Error al eliminar modelo");
      res.redirect("/dashboard/models");
    }
  },

};