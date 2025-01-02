import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { useQueue } from 'discord-player';
 
export const data = new SlashCommandBuilder()
  .setName('skip')
  .setDescription('Salta la musica que se esta reproduciento actualmente');
 
export async function execute(interaction: CommandInteraction) {
  const queue = useQueue(interaction.guild?.id!);
 
  if (!queue) {
    return interaction.reply('Actualmente no se está reproduciendo nada en el servidor.');
  }
 
  if (!queue.isPlaying()) {
    return interaction.reply('No hay musica reproduciendose.');
  }

  let currentTittle = queue.currentTrack?.title;
  queue.node.skip();
 
  return interaction.reply(`La canción ${currentTittle} se ha omitido.`);
}