const componentModel = require('../models/componentModel');
const marcaModel = require('../models/brandModel');
const modeloModel = require("../models/modelsModel");
const tipoComponenteModel = require("../models/componentTypeModel");

module.exports = {
  list: async (req, res) => {
    try {
      const components = await componentModel.findAll();
      res.render("component/list", {
        components,
        title: "Componentes",
        user: req.session.user,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al listar componentes");
    }
  },

  getModelosByMarca: async (req, res) => {
    try {
      const idMarca = req.params.id;
      const modelos = await modeloModel.findByIdMarca(idMarca);
      console.log("Estos son los modelos: "+modelos)
      res.json(modelos);
    } catch (error) {
      console.error(error);
      res.status(500).json([]); // Return empty array on error
    }
  },

  showCreateForm: async (req, res) => {
    try {
      const marcas = await marcaModel.findAll();      
      const tipos_componentes = await tipoComponenteModel.findAll();
      res.render("component/create", {
        marcas,        
        tipos_componentes,
        title: "Nuevo Componente",
        user: req.session.user,
      });
    } catch (error) {
      console.error(error);
    }
  },

  create: async (req, res) => {
    try {
      const { id_marca, id_modelo, id_tipo_componente, numero_serie } =
        req.body;
      await componentModel.create(
        id_marca,
        id_modelo,
        id_tipo_componente,
        numero_serie
      );
      req.flash("success_msg", "Componente creado con exito");
      res.redirect("/dashboard/component");
    } catch (error) {
      console.error(error);
      req.flash("error_msg", "Error al crear el componente");
      res.redirect("/dashboard/component/new");
    }
  },

  edit: async (req, res) => {
    try {
      const id = req.params.id;
      const component = await componentModel.findById(id);
      if (!component) {
        req.flash("error_msg", "Componente no encontrado");
        return res.redirect("/dashboard/component");
      }
      const marcas = await marcaModel.findAll();
      const modelos = await modeloModel.findByIdMarca(component.id_marca);      
      const tipos_componentes = await tipoComponenteModel.findAll();
      res.render("component/edit", {
        component,
        marcas,
        modelos,
        tipos_componentes,
        title: "Editar componentes",
        user: req.session.user,
      });
    } catch (error) {
      console.error(error);
      req.flash("error_msg", "Error al cargar el componente");
      res.redirect("/dashboard/component");
    }
  },

  update: async (req, res) => {
    const id = req.params.id;
    try {
      const { id_marca, id_modelo, id_tipo_componente, numero_serie } =
        req.body;
      const updated = await componentModel.update(
        id,
        id_marca,
        id_modelo,
        id_tipo_componente,
        numero_serie
      );
      if (updated) {
        req.flash("success_msg", "Componente actualizado con exito");
      } else {
        req.flash("error_msg", "Error al actualizar el componente");
      }
      res.redirect("/dashboard/component");
    } catch (error) {
      console.error(error);
      req.flash("error_msg", "Error al actualizar componente");
      res.redirect(`/dashboard/component/${id}/edit`);
    }
  },

  delete: async (req, res) => {
    try {
      const id = req.params.id;
      const deleted = await componentModel.delete(id);
      if (deleted) {
        req.flash("success_msg", "Componente eliminado exitosamente");
      } else {
        req.flash("error_msg", "Error al eliminar el componente");
      }
      res.redirect("/dashboard/component");
    } catch (error) {
      console.error(error);
      req.flash("error_msg", "Error al eliminar componente");
      res.redirect("/dashboard/component");
    }
  },
};