import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { useQueue } from "discord-player";

export const data = new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Detiene tu cola de reproducción.");

export async function execute(interaction: CommandInteraction) {
    const queue = useQueue(interaction.guild?.id!);
    queue?.delete();

    return await interaction.reply(`La lista de reproducción se ha detenido.`);
}
