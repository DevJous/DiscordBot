import { REST, Routes } from "discord.js";
import { config } from "./../config";
import { commands } from "./cmd-hub";

const commandsData = Object.values(commands).map((command) => command.data);

const rest = new REST({ version: "10" }).setToken(config.DISCORD_TOKEN);

type DeployCommandsProps = {
  guildId: string;
};

export async function deployCommands({ guildId }: DeployCommandsProps) {
  try {
    console.log("Recargando los comandos (/) de la aplicacion.");

    await rest.put(
      Routes.applicationGuildCommands(config.DISCORD_CLIENT_ID, guildId),
      {
        body: commandsData,
      }
    );

    console.log("Los comandos (/) de la aplicacion se recargaron correctamente.");
  } catch (error) {
    console.error(error);
  }
}