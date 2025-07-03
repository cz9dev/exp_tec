// controllers/areaController.js
const AreaModel = require("../models/areaModel");

module.exports = {

  listAreas: async (req, res) => {

    const { page = 1, limit = 10, search = "" } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = "";
    if (search) {
      whereClause = `WHERE nombre LIKE '%${search}%'`;
    }

    try {

      const [areas, count] = await Promise.all([
        AreaModel.findAllWithPagination(limit, offset, whereClause), // Nueva función del modelo
        AreaModel.count(whereClause), // Nueva función para el conteo total
      ]);
      
      res.render("areas/list", {
        count,
        limit,
        page,
        search,
        currentPage: parseInt(page),
        title: "Area",
        user: req.session.user,
        areas: areas,
      });
    } catch (error) {
      console.error("Error en listAreas:", error);
      res.status(500).send("Error interno");
    }
  },

  showCreateForm: async (req, res) => {
    try {      
      res.render("areas/create", {
        title: "Areas",        
        user: req.session.user,
      });
    } catch (error) {
      console.error(error);
    }
  },

  createArea: async (req, res) => {
    try {
      const { nombre } = req.body;
      // Validación de unicidad
      const existingArea = await AreaModel.findOne(nombre);
      if (existingArea) {
        req.flash("error_msg", "Ya existe una area con ese nombre.");
        return res.redirect("areas/new"); // Redirige de vuelta al formulario
      }

      await AreaModel.create({ nombre });
      req.flash("success_msg", "Area creada exitosamente");
      res.redirect("areas");
    } catch (error) {
      console.error("Error en createArea:", error);
      req.flash("error_msg", "Error al crear el area");
      res.redirect("areas/new"); // Redirige de vuelta al formulario con error
    }
  },


  showEditForm: async (req, res) => {
    try {
      const area = await AreaModel.findById(req.params.id);
      if (!area) {
        req.flash("error_msg", "Area no encontrada");
        return res.redirect("areas");
      }
      res.render("areas/edit", { title: "Editar Area", area: area, user: req.session.user });
    } catch (error) {
      console.error("Error en showEditForm:", error);
      req.flash("error_msg", "Error al cargar el area");
      res.redirect("areas");
    }
  },

  updateArea: async (req, res) => {
    try {
      const { id } = req.params;
      const { nombre } = req.body;

      // Validación de unicidad
      const existingArea = await AreaModel.findOne(nombre);
      if (existingArea) {
        req.flash("error_msg", "Ya existe un area con ese nombre.");
        return res.redirect("/dashboard/areas/"+id+"/edit"); // Redirige de vuelta al formulario
      }

      await AreaModel.update(id, { nombre });
      req.flash("success_msg", "Area actualizada exitosamente");
      res.redirect("/dashboard/areas");
    } catch (error) {
      console.error("Error en updateArea:", error);
      req.flash("error_msg", "Error al actualizar el area");
      res.redirect(`/dashboard/areas/${id}/edit`); // Redirige de vuelta al formulario con error
    }
  },

  deleteArea: async (req, res) => {
    try {
      await AreaModel.delete(req.params.id);
      req.flash("success_msg", "Area eliminada exitosamente");
      res.redirect("/dashboard/areas");
    } catch (error) {
      console.error("Error en deleteArea:", error);
      req.flash("error_msg", "Error al eliminar el area");
      //res.redirect("areas");
    }
  },
};