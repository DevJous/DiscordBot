import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { useQueue } from 'discord-player';
 
export const data = new SlashCommandBuilder()
  .setName('shuffle') // Command name
  .setDescription('Shuffle the tracks in the queue'); // Command description
 
export async function execute(interaction: CommandInteraction) {
  // Get the current queue
  const queue = useQueue();
 
  if (!queue) {
    return interaction.reply('This server does not have an active player session.');
  }
 
  // Check if there are enough tracks in the queue
  if (queue.tracks.size < 2) return interaction.reply('There are not enough tracks in the queue to shuffle.');
 
  // Shuffle the tracks in the queue
  queue.tracks.shuffle();
 
  // Send a confirmation message
  return interaction.reply(`Shuffled ${queue.tracks.size} tracks.`);
}