# Exp_Tec
Es una aplicación web para el registro y control de expedientes técnicos de dispositivos, controlando marcas, modelos y numeros de series, componentes y perifericos. Además un control de sellos de estos dispositivos y un registro de insidencias.

![GitHub License](https://img.shields.io/github/license/cz9dev/exp_tec)
![GitHub repo size](https://img.shields.io/github/repo-size/cz9dev/exp_tec)
![GitHub Tag](https://img.shields.io/github/v/tag/cz9dev/exp_tec)
[![All Contributors](https://img.shields.io/github/all-contributors/projectOwner/projectName?color=ee8449&style=flat-square)](#contributors)

# Requerimientos
- MySQL o MariaDB
- Node.js

# Instalación
El proyecto esta en desarrollo por lo que por el momento si deceas probarlo debes desplegar un entorno de desarrollo para Nodejs y luego de clonar este repositorio debes poblar los datos iniciales de la base de datos ejecutando el archivo /config/seed.js (en desarrollo).

Alternativamente solo debes restaurar la base de datos en mysql o mariadb

## Uso
Credenciales por defecto al restaurar la base de datos
**usuario: admin**
**password:exptec** 

# Caracteristicas
Por el momento las caracteristicas que estan o se decean implementar en la app son las que se mencionan, si estan - [] es que estan por desarrollar, si esta de la siguiente forma - [X] es que ya ha sido implementada

- [x] Login y Logout
    - [x] Login
    - [x] Register
    - [x] Logout
- [ ] Dashboard
    - [ ] Dashboard
- [X] Seguridad
    - [x] Usuario
    - [x] Roles
    - [X] Permisos
- [ ] Gestion
    - [X] Marcas
    - [X] Áreas
    - [X] Trabajadores
    - [X] Tipos de Componentes
    - [X] Componentes
    - [X] Tipos de Perifericos
    - [X] Perifericos
    - [ ] Dispositivos
    - [ ] Actividades
    - [ ] Sellos

- [ ] Reportes
    - [ ] Expedientes técnicos
    - [ ] Registros de incidencia    
    - [ ] Registro de sellos
    - [ ] Registro de partes y piezas

- [x] Perfil de usuario
    - [x] Gestionar perfil

# Contribuir
Si usted decea constribuir con Exp-tec por favor lea el fichero [CONTRIBUTING.md](CONTRIBUTING.md). Aceptamos todo tipo de constribución, parches, nuevas ideas, reportes de fallos o mejoras, lo que usted crea necesario.

# Contribuciones

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

Este proyecto sigue las recomendaciones [all-contributors](https://github.com/all-contributors/all-contributors). ¡Cualquier tipo de contribución es bien recibida!