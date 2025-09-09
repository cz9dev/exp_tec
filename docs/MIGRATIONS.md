# 🚀 Guía de Migraciones

## Flujo de trabajo para cambios en base de datos

### 1. Antes de crear una migración

✅ Verificar el estado actual:

```bash
npx sequelize-cli db:migrate:status
```

## Comandos útiles

| Comando                       | Descripción                               |
| ----------------------------- | ----------------------------------------- |
| `npm run db:migrate`          | Ejecutar todas las migraciones pendientes |
| `npm run db:migrate:undo`     | Revertir última migración                 |
| `npm run db:migrate:undo:all` | Revertir todas las migraciones            |
