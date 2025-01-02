
import dotenv from "dotenv";

dotenv.config();

const { DISCORD_TOKEN, DISCORD_CLIENT_ID } = process.env;

if (!DISCORD_TOKEN || !DISCORD_CLIENT_ID) {
  throw new Error(`No se encontro el token o id del cliente en las variables de entorno.`);
}

export const config = {
  DISCORD_TOKEN,
  DISCORD_CLIENT_ID,
};