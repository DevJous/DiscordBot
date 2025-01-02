
import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Responde con un Pong!");

export async function execute(interaction: CommandInteraction) {
  return await interaction.reply("Pong!");
}
