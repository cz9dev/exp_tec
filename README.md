<p align="center" width="100%" style="filter: brightness(2); background: #889;">
  <img src="imgs/logo.png" width="200" height="200"></br>  
</p>

![GitHub License](https://img.shields.io/github/license/cz9dev/exp_tec)
![GitHub repo size](https://img.shields.io/github/repo-size/cz9dev/exp_tec)
![GitHub Tag](https://img.shields.io/github/v/tag/cz9dev/exp_tec)
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

Exp-tec es una aplicación web para el registro y control de expedientes técnicos de dispositivos, controlando marcas, modelos y números de series, componentes y perifericos. Además un control de sellos de estos dispositivos, acciones y tareas realizadas sobre los dispositivos.

# ScreenShot

## ScreenShot-Login
![](imgs/screenshot-login.png)
## ScreenShot-Dashboard
![](imgs/screenshot-dashboard.png)

# Requerimientos
- MySQL o MariaDB
- Node.js

# Instalación
El proyecto está desarrollado con Node.js, para probarlo debes desplegar un entorno de desarrollo para Nodejs y luego de clonar este repositorio.

## Instalacion de dependencias
Instalaremos las dependencias de nuestro proyecto con:

  ```bash
    npm install
  ```

## Poblar DB
Luego debes poblar la DB con los datos iniciales ejecutando el archivo ```/config/seed.js``` (en desarrollo).

Alternativamente solo debes restaurar la base de datos en mysql o mariadb que se encuentra en el directorio ```/db```

## Configurar
En el archivo .env que esta en la raiz del proyecto debes modificar los datos siguientes segun tu configuración msql o mariadb:

```
DB_HOST=localhost
DB_USER=root
DB_PASS=numlock
DB_NAME=exp_tec
```

## Uso
Credenciales por defecto al restaurar la base de datos
**usuario: admin**
**password:exptec** 

# Contribuir
Si usted decea constribuir con Exp-tec por favor lea el fichero [CONTRIBUTING.md](CONTRIBUTING.md). Aceptamos todo tipo de constribución, parches, nuevas ideas, reportes de fallos o mejoras, lo que usted crea necesario.

# Contribuciones

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://cz9dev.github.io/"><img src="https://avatars.githubusercontent.com/u/97544746?v=4?s=100" width="100px;" alt="Carlos Zaldívar"/><br /><sub><b>Carlos Zaldívar</b></sub></a><br /><a href="#code-cz9dev" title="Code">💻</a> <a href="#doc-cz9dev" title="Documentation">📖</a> <a href="#design-cz9dev" title="Design">🎨</a> <a href="#test-cz9dev" title="Tests">⚠️</a> <a href="#maintenance-cz9dev" title="Maintenance">🚧</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

Este proyecto sigue las recomendaciones [all-contributors](https://github.com/all-contributors/all-contributors). ¡Cualquier tipo de contribución es bien recibida!