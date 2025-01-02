import { CommandInteraction, SlashCommandBuilder, GuildMember, PermissionsBitField } from "discord.js";
import { QueryType } from "discord-player";
import { getPlayer } from "../../../services/player.service";

export const data = new SlashCommandBuilder()
    .setName("play")
    .setDescription("Reproduce una canción en tu canal de voz.")
    .addStringOption(option =>
        option
            .setName("cancion")
            .setDescription("El nombre o URL de la canción que quieres reproducir.")
            .setRequired(true)
    );

export async function execute(interaction: CommandInteraction) {
    await interaction.deferReply();

    const player = getPlayer();
    const cancion = interaction.options.get('cancion', true).value as string;

    if (interaction.member instanceof GuildMember) {
        const voiceChannel = interaction.member.voice.channel;
        const member = interaction.guild?.members.me;

        if (!voiceChannel) {
            return interaction.editReply('¡Necesitas estar en un canal de voz para reproducir música!');
        }

        if (member!.voice.channel && member!.voice.channel !== voiceChannel) {
            return interaction.editReply('¡Ya estoy reproduciendo en un canal de voz diferente!');
        }

        if (!voiceChannel.permissionsFor(member!).has(PermissionsBitField.Flags.Connect)) {
            return interaction.editReply('¡No tengo permiso para unirme a tu canal de voz!');
        }

        if (!voiceChannel.permissionsFor(member!).has(PermissionsBitField.Flags.Speak)) {
            return interaction.editReply('¡No tengo permiso para hablar en tu canal de voz!');
        }

        try {
            let queue = player.queues.get(interaction.guildId!);

            if (!queue) {
                queue = player.queues.create(interaction.guild!, {
                    metadata: interaction.channel,
                    leaveOnEnd: false,
                    leaveOnEmpty: true,
                    leaveOnStop: true,
                });

                try {
                    if (!queue.connection) await queue.connect(voiceChannel);
                } catch {
                    void player.queues.delete(interaction.guildId!);
                    return void interaction.followUp({ content: "No fue posible unirse al canal de voz!" });
                }
            }

            const searchResult = await player
                .search(cancion, {
                    requestedBy: interaction.user,
                    searchEngine: QueryType.AUTO
                })
                .catch(() => { });

            if (!searchResult || !searchResult.tracks.length) return void interaction.followUp({ content: "No se encontraron resultados." });
            await interaction.followUp({ content: `⏱ | Cargando tu ${searchResult.playlist ? "playlist" : "canción"}...` });

            if (searchResult.playlist) {
                queue.addTrack(searchResult.tracks);
            } else {
                queue.addTrack(searchResult.tracks[0]);
            }

            if (!queue.isPlaying()) {
                await queue.node.play();
            }

            return interaction.editReply(
                `${searchResult.playlist ? `Playlist **${searchResult.playlist.title}**` : searchResult.tracks[0].title} ha sido añadida a la cola!`
            );
        } catch (error) {
            console.error('Error al reproducir la canción:', error);
            return interaction.editReply('Ocurrió un error al intentar reproducir la canción.');
        }
    } else {
        await interaction.reply({ content: 'El miembro no es un miembro de un servidor.', ephemeral: true });
        return;
    }
}
