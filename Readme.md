# Exp_Tec
Es una aplicación web para el registro y control de expedientes técnicos de dispositivos, controlando marcas, modelos y numeros de series, componentes y perifericos. Además un control de sellos de estos dispositivos y un registro de insidencias.

![GitHub License](https://img.shields.io/github/license/cz9dev/exp_tec)
![GitHub repo size](https://img.shields.io/github/repo-size/cz9dev/exp_tec)
![GitHub Tag](https://img.shields.io/github/v/tag/cz9dev/exp_tec)

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

# Contribuir
Para contribuir con el prollecto usted debe revizar como va el desarrollo de la aplicación, a continuación muestro los módulos que estan previstos, con una x seleccionado los que ya han sido implementado, seguido del desarrollador, si usted desea contribuir solo debe poner al final del módulo su usuario y una ves termanado una x.

- [x] Login y Logout
    - [x] Login - @cz9dev
    - [x] Register - @cz9dev
    - [x] Logout - @cz9dev
- [ ] Dashboard
    - [ ] Dashboard
- [ ] Seguridad
    - [x] Usuario - @cz9dev
    - [x] Roles - @cz9dev
    - [ ] Permisos
- [ ] Gestion
    - [X] Marcas - @cz9dev
    - [X] Modelos - @cz9dev
    - [X] Áreas - @cz9dev
    - [X] Trabajadores - @cz9dev
    - [ ] Tipos de Componentes
    - [ ] Componentes
    - [ ] Tipos de Perifericos
    - [ ] Perifericos
    - [ ] Dispositivos

- [ ] Reportes
    - [ ] Expedientes técnicos
    - [ ] Registros de incidencia    
    - [ ] Registro de sellos
    - [ ] Registro de partes y piezas

- [x] Perfil de usuario
    - [x] Gestionar perfil - @cz9dev

# Desarrolladores
[cz9dev](https://github.com/cz9dev)