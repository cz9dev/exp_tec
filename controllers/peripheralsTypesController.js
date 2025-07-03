const peripheralsTypesModel = require("../models/peripheralsTypesModel");

module.exports = {
  list: async (req, res) => {

    const { page = 1, limit = 10, search = "" } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = "";
    if (search) {
      whereClause = `WHERE nombre LIKE '%${search}%'`;
    }

    try {

      const [peripheralsTypes, count] = await Promise.all([
        peripheralsTypesModel.findAllWithPagination(limit, offset, whereClause), // Nueva función del modelo
        peripheralsTypesModel.count(whereClause), // Nueva función para el conteo total
      ]);
      
      res.render("peripheralsTypes/list", {
        count,
        limit,
        page,
        search,
        currentPage: parseInt(page),
        title: "Tipos de perifericos",
        user: req.session.user,
        peripheralsTypes,
      });
    } catch (error) {
      console.error("Error en list peripheralsTypes:", error);
      res.status(500).send("Error interno");
    }
  },

  showCreateForm: async (req, res) => {
    try {      
      res.render("peripheralsTypes/create", {
        title: "Tipos de Perifericos",
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
      const existingPeripheralsTypes = await peripheralsTypesModel.findOne(nombre);
      if (existingPeripheralsTypes) {
        req.flash("error_msg", "Ya existe un periferico con ese nombre.");
        return res.redirect("peripheralsTypes/new"); // Redirige de vuelta al formulario
      }

      await peripheralsTypesModel.create({ nombre });
      req.flash("success_msg", "Tipo de periferico creado exitosamente");
      res.redirect("peripheralsTypes");
    } catch (error) {
      console.error("Error en create peripheralsTypes:", error);
      req.flash("error_msg", "Error al crear el tipo de periferico");
      res.redirect("peripheralsTypes/new"); // Redirige de vuelta al formulario con error
    }
  },


  showEditForm: async (req, res) => {
    try {
      const peripheralsTypes = await peripheralsTypesModel.findById(req.params.id);
      if (!peripheralsTypes) {
        req.flash("error_msg", "Tipo de periferico no encontrado");
        return res.redirect("peripheralsTypes");
      }
      res.render("peripheralsTypes/edit", {
        title: "Editar tipo de periferico",
        peripheralsTypes,
        user: req.session.user,
      });
    } catch (error) {
      console.error("Error en showEditForm:", error);
      req.flash("error_msg", "Error al cargar el tipo de periferico");
      res.redirect("peripheralsTypes");
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { nombre } = req.body;

      // Validación de unicidad
      const existingPeripheralsTypes = await peripheralsTypesModel.findOne(nombre);
      if (existingPeripheralsTypes) {
        req.flash("error_msg", "Ya existe un tipo de periferico con ese nombre.");
        return res.redirect("/dashboard/peripheralsTypes/" + id + "/edit"); // Redirige de vuelta al formulario
      }

      await peripheralsTypesModel.update(id,  nombre );
      req.flash("success_msg", "Tipo de periferico actualizado exitosamente");
      res.redirect("/dashboard/peripheralsTypes");
    } catch (error) {
      console.error("Error en update tipo de periferico:", error);
      req.flash("error_msg", "Error al actualizar el tipo de periferico");
      res.redirect(`/dashboard/peripheralsTypes/${id}/edit`); // Redirige de vuelta al formulario con error
    }
  },

  delete: async (req, res) => {
    try {
      await peripheralsTypesModel.delete(req.params.id);
      req.flash("success_msg", "Tipo de periferico eliminado exitosamente");
      res.redirect("/dashboard/peripheralsTypes");
    } catch (error) {
      console.error("Error en delete peripheralsTypes:", error);
      req.flash("error_msg", "Error al eliminar el tipo de periferico");
      res.redirect("/dasboard/peripheralsTypes");
    }
  },
};