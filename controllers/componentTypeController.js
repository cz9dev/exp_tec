const ComponentTypeModel = require("../models/componentTypeModel");

module.exports = {

  list: async (req, res) => {

    const { page = 1, limit = 10, search = "" } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = "";
    if (search) {
      whereClause = `WHERE nombre LIKE '%${search}%'`;
    }

    try {

      const [componentTypes, count] = await Promise.all([
        ComponentTypeModel.findAllWithPagination(limit, offset, whereClause), // Nueva función del modelo
        ComponentTypeModel.count(whereClause), // Nueva función para el conteo total
      ]);
      
      res.render("componentTypes/list", {
        count,
        limit,
        page,
        search,
        currentPage: parseInt(page),
        title: "Tipos de Componentes",
        user: req.session.user,
        componentTypes,
      });
    } catch (error) {
      console.error("Error en list componentTypes:", error);
      res.status(500).send("Error interno");
    }
  },

  showCreateForm: async (req, res) => {
    try {      
      res.render("componentTypes/create", {
        title: "Tipos de Componentes",        
        user: req.session.user,
      });
    } catch (error) {
      console.error(error);
    }
  },

  create: async (req, res) => {
    try {
      const { nombre } = req.body;
      // Validación de unicidad
      const existingComponentType = await ComponentTypeModel.findOne(nombre);
      if (existingComponentType) {
        req.flash("error_msg", "Ya existe un de componente con ese nombre.");
        return res.redirect("componentTypes/new"); // Redirige de vuelta al formulario
      }

      await ComponentTypeModel.create({ nombre });
      req.flash("success_msg", "Tipo de componente creado exitosamente");
      res.redirect("componentTypes");
    } catch (error) {
      console.error("Error en create componentTypes:", error);
      req.flash("error_msg", "Error al crear el tipo de componente");
      res.redirect("componentTypes/new"); // Redirige de vuelta al formulario con error
    }
  },


  showEditForm: async (req, res) => {
    try {
      const componentType = await ComponentTypeModel.findById(req.params.id);
      if (!componentType) {
        req.flash("error_msg", "Tipo de componente no encontrado");
        return res.redirect("componentTypes");
      }
      res.render("componentTypes/edit", {
        title: "Editar tipo de componente",
        componentType,
        user: req.session.user,
      });
    } catch (error) {
      console.error("Error en showEditForm:", error);
      req.flash("error_msg", "Error al cargar el tipo de componente");
      res.redirect("componentTypes");
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { nombre } = req.body;

      // Validación de unicidad
      const existingComponentType = await ComponentTypeModel.findOne(nombre);
      if (existingComponentType) {
        req.flash("error_msg", "Ya existe un tipo de componente con ese nombre.");
        return res.redirect("/dashboard/componentTypes/"+id+"/edit"); // Redirige de vuelta al formulario
      }

      await ComponentTypeModel.update(id,  nombre );
      req.flash("success_msg", "Tipo de componente actualizado exitosamente");
      res.redirect("/dashboard/componentTypes");
    } catch (error) {
      console.error("Error en update tipo de componente:", error);
      req.flash("error_msg", "Error al actualizar el tipo de componente");
      res.redirect(`/dashboard/componentTypes/${id}/edit`); // Redirige de vuelta al formulario con error
    }
  },

  delete: async (req, res) => {
    try {
      await ComponentTypeModel.delete(req.params.id);
      req.flash("success_msg", "Tipo de componente eliminado exitosamente");
      res.redirect("/dashboard/componentTypes");
    } catch (error) {
      console.error("Error en delete componentType:", error);
      req.flash("error_msg", "Error al eliminar el tipo de componente");
      res.redirect("/dasboard/componentTypes");
    }
  },
};