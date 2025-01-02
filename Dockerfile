# Usa una imagen base con Node.js
FROM node:18

# Instala FFmpeg para reproducir música
RUN apt-get -y update
RUN apt-get -y upgrade
#RUN apt-get install -y ffmpeg
#RUN apt-get clean

# Crea un directorio de trabajo
WORKDIR /usr/src/app

# Copia los archivos de configuración del proyecto
COPY package*.json tsconfig.json ./

# Instala las dependencias del proyecto
RUN npm install

# Copia el código fuente
COPY src ./src

# Compila el código TypeScript a JavaScript
RUN npm run build

# Establece el puerto si es necesario (opcional)
EXPOSE 3000

# Ejecuta el bot
CMD ["npm", "start"]
