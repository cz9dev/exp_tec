const peripheralsModel = require("../models/peripheralsModel");
const marcaModel = require('../models/brandModel');
const peripheralsTypeModel = require("../models/peripheralsTypesModel");

module.exports = {
  list: async (req, res) => {
    try {
      const perifericos = await peripheralsModel.findAll();
      res.render("peripherals/list", {
        perifericos,
        title: "Perifericos",
        user: req.session.user,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al listar peripherals");
    }
  },

  showCreateForm: async (req, res) => {
    try {
      const marcas = await marcaModel.findAll();      
      const tipos_perifericos = await peripheralsTypeModel.findAll();
      res.render("peripherals/create", {
        marcas,
        tipos_perifericos,
        title: "Nuevo Periferico",
        user: req.session.user,
      });
    } catch (error) {
      console.error(error);
    }
  },

  create: async (req, res) => {
    try {
      const { id_marca, modelo, id_tipo_periferico, numero_serie } = req.body;
      await peripheralsModel.create(
        id_marca,
        modelo,
        id_tipo_periferico,
        numero_serie
      );
      req.flash("success_msg", "Periferico creado con exito");
      res.redirect("/dashboard/peripherals");
    } catch (error) {
      console.error(error);
      req.flash("error_msg", "Error al crear el periferico");
      res.redirect("/dashboard/peripherals/new");
    }
  },

  edit: async (req, res) => {
    try {
      const id = req.params.id;
      const periferico = await peripheralsModel.findById(id);
      if (!periferico) {
        req.flash("error_msg", "Periferico no encontrado");
        return res.redirect("/dashboard/peripherals");
      }
      const marcas = await marcaModel.findAll();      
      const tipos_perifericos = await peripheralsTypeModel.findAll();
      res.render("peripherals/edit", {
        periferico,
        marcas,        
        tipos_perifericos,
        title: "Editar periferico",
        user: req.session.user,
      });
    } catch (error) {
      console.error(error);
      req.flash("error_msg", "Error al cargar el periferico");
      res.redirect("/dashboard/peripherals");
    }
  },

  update: async (req, res) => {
    const id = req.params.id;
    try {
      const { id_marca, modelo, id_tipo_periferico, numero_serie } = req.body;
      const updated = await peripheralsModel.update(
        id,
        id_marca,
        modelo,
        id_tipo_periferico,
        numero_serie
      );
      if (updated) {
        req.flash("success_msg", "Periferico actualizado con exito");
      } else {
        req.flash("error_msg", "Error al actualizar el periferico");
      }
      res.redirect("/dashboard/peripherals");
    } catch (error) {
      console.error(error);
      req.flash("error_msg", "Error al actualizar periferico");
      res.redirect(`/dashboard/peripherals/${id}/edit`);
    }
  },

  delete: async (req, res) => {
    try {
      const id = req.params.id;
      const deleted = await peripheralsModel.delete(id);
      if (deleted) {
        req.flash("success_msg", "Periferico eliminado exitosamente");
      } else {
        req.flash("error_msg", "Error al eliminar el periferico");
      }
      res.redirect("/dashboard/peripherals");
    } catch (error) {
      console.error(error);
      req.flash("error_msg", "Error al eliminar periferico");
      res.redirect("/dashboard/peripherals");
    }
  },
};