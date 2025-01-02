# MrJous - Bot de Música 🎵

MrJous es un bot de música diseñado para ofrecer una experiencia musical sencilla y agradable en tu servidor de Discord. ¡Disfruta de tus canciones favoritas con comandos simples y una configuración flexible!

---

## 🚀 Características

- **Reproduce música desde múltiples plataformas.**
- **Soporte para playlists.**
- **Comandos fáciles de usar.**
- **Configuración y despliegue rápido con Docker.**

---

## 📦 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/DevJous/DiscordBot.git
cd DiscordBot
```

### 2. Instalar dependencias

Asegúrate de tener [Node.js](https://nodejs.org/) y [npm](https://www.npmjs.com/) instalados.

```bash
npm install
```

### 3. Configurar el archivo `.env`

Crea un archivo `.env` en la raíz del proyecto y añade tus configuraciones personalizadas, como tu token y ID del cliente de Discord.

> [!NOTE]
> Recuerda obtener el token y el ID de cliente en la página de [desarrolladores de Discord](https://discord.com/developers/applications).

```env
DISCORD_TOKEN="<Ingresa aqui tu token de Discord>"
DISCORD_CLIENT_ID="<Ingresa aqui tu Discord client Id>"
```

---

## 🔧 Scripts Disponibles

- `npm run dev`: Inicia el bot en modo desarrollo.
- `npm run build`: Genera una versión optimizada para producción.
- `npm run start`: Inicia el bot en modo producción.

---

## 🐳 Usar con Docker

### 1. Construir la imagen

```bash
docker build -t mrjous .
```

### 2. Ejecutar el contenedor

```bash
docker run -d --name mrjous-container mrjous
```

### 3. Configuración avanzada

Si necesitas personalizar los puertos o variables de entorno:

```bash
docker run -d --name mrjous-container \
  --env-file .env \
  -p 3000:3000 \
  mrjous
```

---

## 🛠 Tecnologías

- **Node.js**
- **Discord.js** *(o la librería que estés usando)*
- **Docker**

---

## 📜 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo `LICENSE` para más detalles.

---

## 💌 Contribuciones

¡Las contribuciones son bienvenidas! Si tienes ideas para mejorar el bot o encuentras un bug, abre un *issue* o crea un *pull request*.

---

¡Disfruta usando **MrJous**! 🎶
