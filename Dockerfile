# Dockerfile
# Usa la imagen oficial de Node.js 18 (versión requerida por el proyecto)
FROM node:18-alpine

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de definición de paquetes
COPY package*.json ./

# Instala las dependencias de la aplicación
RUN npm install

# Copia el resto del código de la aplicación
COPY . .

# Expone el puerto en el que la app escucha (por defecto 3000)
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["npm", "start"]