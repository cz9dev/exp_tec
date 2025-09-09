# 📦 Migraciones de Base de Datos

## Migración aplicada: Fix relación Dispositivo-Trabajador

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

### Cambios recientes en relaciones (Issue #66)

1. **Eliminó** constraint foreign key antiguo que apuntaba a usuario
2. **Creó** nuevo constraint con relación correcta apuntando a trabajador

### Para revertir

```bash
npx sequelize-cli db:migrate:undo --name 20250909-fix-dispositivo-relation
```
