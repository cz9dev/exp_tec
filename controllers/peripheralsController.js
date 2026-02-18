const peripheralsModel = require("../models/peripheralsModel");
const marcaModel = require("../models/brandModel");
const peripheralsTypeModel = require("../models/peripheralsTypesModel");

const multer = require("multer");
const fs = require("fs"); // Importar el módulo fs para manipular archivos
const path = require("path");

// Configurar Multer para guardar las imágenes en el directorio 'public/perifericos'
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/perifericos/"));
  },
  filename: function (req, file, cb) {
    const numero_serie = req.body.numero_serie;
    if (!numero_serie) {
      return cb(new Error("Número de serie es requerido"), null);
    }

    // Construimos el nombre del archivo: numero_serie + extensión original
    const ext = path.extname(file.originalname);
    const filename = `${numero_serie}${ext}`;
    cb(null, filename);
  },
});
const upload = multer({ storage: storage });

module.exports = {
  list: async (req, res) => {
    const { page = 1, limit = 10, search = "" } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = "";
    if (search) {
      whereClause = `WHERE (p.modelo LIKE '%${search}%' OR p.numero_serie LIKE '%${search}%' OR p.numero_inventario LIKE '%${search}%')`;
    }

    try {
      const [perifericos, count] = await Promise.all([
        peripheralsModel.findAllWithPagination(limit, offset, whereClause), // Nueva función del modelo
        peripheralsModel.count(whereClause), // Nueva función para el conteo total
      ]);

      res.render("peripherals/list", {
        perifericos,
        count,
        limit,
        page,
        search,
        currentPage: parseInt(page),
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
      upload.single("url_image")(req, res, async (err) => {
        const {
          id_marca,
          modelo,
          id_tipo_periferico,
          numero_serie,
          numero_inventario,
        } = req.body;

        // Verificar unisidad de periferico por numero de serie
        const existingPeripherals =
          await peripheralsModel.findOne(numero_serie);

        if (existingPeripherals) {
          req.flash("error_msg", "Ya existe un periferico con ese nombre.");
          return res.redirect("peripherals/new"); // Redirige de vuelta al formulario
        }

        if (err) {
          console.error("Error al subir la imagen: ", err);
          req.flash("error_msg", "Error al subir la imagen.");
          return res.redirect("/dashboard/peripherals");
        }

        const url_image = req.file ? req.file.filename : null; // Obtiene el nombre del archivo subido

        await peripheralsModel.create(
          id_marca,
          modelo,
          id_tipo_periferico,
          numero_serie,
          numero_inventario,
          url_image,
        );

        req.flash("success_msg", "Periferico creado con exito");
        res.redirect("/dashboard/peripherals");
      });
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
      upload.single("url_image")(req, res, async (err) => {
        if (err) {
          console.error("Error al subir la imagen: ", err);
          req.flash("error_msg", "Error al subir la imagen.");
          return res.redirect("/dashboard/component");
        }

        const {
          id_marca,
          modelo,
          id_tipo_periferico,
          numero_serie,
          numero_inventario,
        } = req.body;
        const updated = await peripheralsModel.update(
          id,
          id_marca,
          modelo,
          id_tipo_periferico,
          numero_serie,
          numero_inventario,
          req.file ? req.file.filename : null, // Asignación condicional
        );
        if (updated) {
          req.flash("success_msg", "Periferico actualizado con exito");
        } else {
          req.flash("error_msg", "Error al actualizar el periferico");
        }
        res.redirect("/dashboard/peripherals");
      });
    } catch (error) {
      console.error(error);
      req.flash("error_msg", "Error al actualizar periferico");
      res.redirect(`/dashboard/peripherals/${id}/edit`);
    }
  },

  deactivate: async (req, res) => {
    try {
      const id = req.params.id;      
      const deactivate = await peripheralsModel.deactivateAt(id);
      if (deactivate) {
        req.flash("success_msg", "Periferico desactivado exitosamente");
      } else {
        req.flash("error_msg", "Error al desactivar el periferico");
      }
      res.redirect("/dashboard/peripherals");
    } catch (error) {
      console.error(error);
      req.flash("error_msg", "Error al desactivar periferico");
      res.redirect("/dashboard/peripherals");
    }
  },

  delete: async (req, res) => {
    try {
      const id = req.params.id;
      // borrar imagen del periferico a borrar
      const periferico = await peripheralsModel.findById(id);
      if (periferico && periferico.url_image) {
        const imagePath = path.join(
          __dirname,
          "../public/perifericos/",
          periferico.url_image,
        );
        try {
          fs.unlinkSync(imagePath);
          console.log("Imagen eliminada correctamente");
        } catch (error) {
          console.error("Error al eliminar la imagen:", error);
          req.flash("error_msg", "Error al eliminar la imagen del componente.");
        }
      }
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
