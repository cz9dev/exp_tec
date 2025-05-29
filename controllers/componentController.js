const componentModel = require("../models/componentModel");
const marcaModel = require("../models/brandModel");
const tipoComponenteModel = require("../models/componentTypeModel");

const multer = require("multer");
const fs = require("fs"); // Importar el módulo fs para manipular archivos
const path = require("path");

// Configurar Multer para guardar las imágenes en el directorio 'public/componentes'
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/componentes/"));
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
      upload.single("url_image")(req, res, async (err) => {
        if (err) {
          console.error("Error al subir la imagen: ", err);
          req.flash("error_msg", "Error al subir la imagen.");
          return res.redirect("/dashboard/component");
        }

        const url_image = req.file ? req.file.filename : null; // Obtiene el nombre del archivo subido

        const { id_marca, modelo, id_tipo_componente, numero_serie } = req.body;
        await componentModel.create(
          id_marca,
          modelo,
          id_tipo_componente,
          numero_serie,
          url_image
        );
        req.flash("success_msg", "Componente creado con exito");
        res.redirect("/dashboard/component");
      });
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
      const tipos_componentes = await tipoComponenteModel.findAll();
      res.render("component/edit", {
        component,
        marcas,
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
      upload.single("url_image")(req, res, async (err) => {
        if (err) {
          console.error("Error al subir la imagen: ", err);
          req.flash("error_msg", "Error al subir la imagen.");
          return res.redirect("/dashboard/component");
        }
        
        const { id_marca, modelo, id_tipo_componente, numero_serie } = req.body;
        const updated = await componentModel.update(
          id,
          id_marca,
          modelo,
          id_tipo_componente,
          numero_serie,
          req.file ? req.file.filename : null // Asignación condicional
        );
        if (updated) {
          req.flash("success_msg", "Componente actualizado con exito");
        } else {
          req.flash("error_msg", "Error al actualizar el componente");
        }
        res.redirect("/dashboard/component");
      });
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
