// controllers/brandController.js
const Brand = require("../models/brandModel");

module.exports = {
  listBrands: async (req, res) => {
    try {
      const brands = await Brand.findAll();
      res.render("brands/list", {
        title: "Marcas",
        user: req.session.user, // Asegúrate de tener la sesión configurada
        brands,
      });
    } catch (error) {
      console.error("Error en listBrands:", error);
      res.status(500).send("Error interno");
    }
  },

  showCreateForm: async (req, res) => {
    try {      
      res.render("brands/create", {
        title: "Marcas",        
        user: req.session.user,
      });
    } catch (error) {
      console.error(error);
    }
  },

  createBrand: async (req, res) => {
    try {
      const { marca } = req.body;
      // Validación de unicidad
      const existingBrand = await Brand.findOne(marca);
      if (existingBrand) {
        req.flash("error_msg", "Ya existe una marca con ese nombre.");
        return res.redirect("brands/new"); // Redirige de vuelta al formulario
      }

      await Brand.create({ marca });
      req.flash("success_msg", "Marca creada exitosamente");
      res.redirect("brands");
    } catch (error) {
      console.error("Error en createBrand:", error);
      req.flash("error_msg", "Error al crear la marca");
      res.redirect("brands/new"); // Redirige de vuelta al formulario con error
    }
  },


  showEditForm: async (req, res) => {
    try {
      const brand = await Brand.findById(req.params.id);
      if (!brand) {
        req.flash("error_msg", "Marca no encontrada");
        return res.redirect("brands");
      }
      res.render("brands/edit", { title: "Editar Marca", brand, user: req.session.user });
    } catch (error) {
      console.error("Error en showEditForm:", error);
      req.flash("error_msg", "Error al cargar la marca");
      res.redirect("brands");
    }
  },

  updateBrand: async (req, res) => {
    try {
      const { id } = req.params;
      const { marca } = req.body;

      // Validación de unicidad
      const existingBrand = await Brand.findOne(marca);
      if (existingBrand) {
        req.flash("error_msg", "Ya existe una marca con ese nombre.");
        return res.redirect("/dashboard/brands/"+id+"/edit"); // Redirige de vuelta al formulario
      }

      await Brand.update(id, { marca });
      req.flash("success_msg", "Marca actualizada exitosamente");
      res.redirect("/dashboard/brands");
    } catch (error) {
      console.error("Error en updateBrand:", error);
      req.flash("error_msg", "Error al actualizar la marca");
      res.redirect(`/dashboard/brands/${id}/edit`); // Redirige de vuelta al formulario con error
    }
  },

  deleteBrand: async (req, res) => {
    try {
      await Brand.delete(req.params.id);
      req.flash("success_msg", "Marca eliminada exitosamente");
      res.redirect("/dashboard/brands");
    } catch (error) {
      console.error("Error en deleteBrand:", error);
      req.flash("error_msg", "Error al eliminar la marca");
      //res.redirect("brands");
    }
  },
};