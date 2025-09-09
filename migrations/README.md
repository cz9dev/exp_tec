# 📦 Migraciones de Base de Datos

## Migraciones aplicadas

### 1. Fix relación Dispositivo-Trabajador

**Archivo**: `20250909-fix-dispositivo-relation.js`
**Issue**: #66
**Fecha**: 09/09/2025

Para ejecutar la migración en la terminal:

```bash
npx sequelize-cli db:migrate
```

Si le diera el error: `ERROR: Dialect needs to be explicitly supplied as of v4.0.0`
entonces ejecute

```bash
npx sequelize-cli db:migrate --url 'mysql://usuario:contraseña@localhost:3306/base_de_datos'
```

#### Cambios realizados (Issue #66)

1. **Eliminó** constraint foreign key antiguo que apuntaba a usuario
2. **Creó** nuevo constraint con relación correcta apuntando a trabajador

#### Para revertir

```bash
npx sequelize-cli db:migrate:undo --name 20250909-fix-dispositivo-relation
```


### 2. Fix tamaño columna `url_image` en tabla `componente`

**Archivo**: `20250909-fix-componente-url-image.js`
**Issue**: #64
**Fecha**: 09/09/2025

Para ejecutar la migración en la terminal:

```bash
npx sequelize-cli db:migrate
```

#### Cambios realizados (Issue #64)

1. **Modificó** la columna `url_image` de la tabla `componente`
   - Tamaño: De `VARCHAR(20)` a `VARCHAR(254)`
   - Permitir nulos: Sí

#### Para revertir

```bash
npx sequelize-cli db:migrate:undo --name 20250909-fix-componente-url-image
```

---

## Guía rápida

### Comandos útiles

- Aplicar todas las migraciones pendientes:
  ```bash
  npx sequelize-cli db:migrate
  ```

- Revertir la última migración:
  ```bash
  npx sequelize-cli db:migrate:undo
  ```

- Ver estado de las migraciones:
  ```bash
  npx sequelize-cli db:migrate:status
  ```

### Si aparece el error `ERROR: Dialect needs to be explicitly supplied as of v4.0.0`

Ejecuta el comando con la URL de conexión:

```bash
npx sequelize-cli db:migrate --url 'mysql://usuario:contraseña@localhost:3306/base_de_datos'