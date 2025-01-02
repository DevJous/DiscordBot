import { CommandInteraction, SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } from 'discord.js';
import { QueryType } from 'discord-player';
import { getPlayer } from '../../../services/player.service';

export const data = new SlashCommandBuilder()
    .setName('search')
    .setDescription('Busca canciones y permite seleccionar una para reproducir.')
    .addStringOption(option =>
        option
            .setName('cancion')
            .setDescription('El término de búsqueda para encontrar canciones.')
            .setRequired(true)
    );

export async function execute(interaction: CommandInteraction) {
    await interaction.deferReply();
    const player = getPlayer();
    const cancion = interaction.options.get('cancion', true).value as string;

    try {
        const searchResult = await player.search(cancion, {
            requestedBy: interaction.user,
            searchEngine: QueryType.AUTO
        });

        if (!searchResult || !searchResult.tracks.length) {
            return interaction.editReply('No se encontraron resultados para tu búsqueda.');
        }

        const tracks = searchResult.tracks.slice(0, 5);

        const trackList = tracks
            .map((track, index) => `${index + 1}. **${track.title}**`)
            .join('\n');

        const buttons = tracks.map((_, index) => {
            return new ButtonBuilder()
                .setCustomId(`select_song_${index}`)
                .setLabel((index + 1).toString())
                .setStyle(ButtonStyle.Primary);
        });

        const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(buttons);

        const message = await interaction.editReply({
            content: `🔎 Resultados de búsqueda:\n${trackList}\n\nSelecciona el número correspondiente para reproducir la canción:`,
            components: [actionRow]
        });

        const collector = message.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: 30000
        });

        collector.on('collect', async (buttonInteraction) => {
            if (!buttonInteraction.customId.startsWith('select_song_')) return;

            const index = parseInt(buttonInteraction.customId.split('_')[2], 10);
            const selectedTrack = tracks[index];

            if (!selectedTrack) {
                return buttonInteraction.reply({ content: 'La canción seleccionada no es válida.', ephemeral: true });
            }

            // Reproducir la canción seleccionada
            let queue = player.queues.get(interaction.guildId!);
            if (!queue) {
                queue = player.queues.create(interaction.guild!, {
                    metadata: interaction.channel,
                    leaveOnEnd: false,
                    leaveOnEmpty: true,
                    leaveOnStop: true,
                });

                try {
                    const voiceChannel = (interaction.member as any).voice.channel;
                    if (!queue.connection) await queue.connect(voiceChannel);
                } catch {
                    void player.queues.delete(interaction.guildId!);
                    return buttonInteraction.reply({ content: 'No fue posible unirse al canal de voz!' });
                }
            }

            queue.addTrack(selectedTrack);
            if (!queue.node.isPlaying()) {
                await queue.node.play();
            }

            await buttonInteraction.reply(`🎵 Reproduciendo: **${selectedTrack.title}**`);
            collector.stop();
        });

        collector.on('end', () => {
            interaction.editReply({ content: 'El tiempo para seleccionar una canción ha expirado.', components: [] });
        });
    } catch (error) {
        console.error('Error al buscar canciones:', error);
        return interaction.editReply('Ocurrió un error al buscar canciones.');
    }
}
