//import { getRandomIPv6 } from '../../common/rnd-ipv6';
//import play, { setToken, video_info } from 'play-dl';
import { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, NoSubscriberBehavior, StreamType } from '@discordjs/voice';
import { CommandInteraction, GuildMember } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import ytdl from '@distube/ytdl-core';
import path from 'path';
import fs from 'fs';


const jsonFilePath = path.resolve(__dirname, '..', '..', '..', 'private', 'own-yt-cookie.json');
const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));
const agent = ytdl.createAgent(jsonData);
// const agent = ytdl.createAgent(jsonData, {
//     localAddress: getRandomIPv6('2001:2::/48')
// });

export const data = new SlashCommandBuilder()
    .setName('ytdlplay')
    .setDescription('Reproduce música desde un enlace de YouTube o Spotify')
    .addStringOption(option =>
        option
            .setName('url')
            .setDescription('Enlace de YouTube o Spotify')
            .setRequired(true)
    );

export async function execute(interaction: CommandInteraction) {
    const url = interaction.options.get('url', true).value as string;

    if (!ytdl.validateURL(url)) {
        await interaction.reply({ content: 'Por favor, proporciona un enlace válido de YouTube.', ephemeral: true });
        return;
    }

    if (interaction.member instanceof GuildMember) {
        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel) {
            await interaction.reply({ content: 'Debes estar en un canal de voz para usar este comando.', ephemeral: true });
            return;
        }

        const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: String(interaction.guild?.id),
            adapterCreator: interaction.guild!.voiceAdapterCreator
        });

        try {
            let info = await ytdl.getBasicInfo(url, { agent: agent });
            let source = await ytdl(url, { filter: 'audioonly', quality: 'highestaudio', agent: agent });

            const resource = createAudioResource(source, {
                inputType: StreamType.Opus
            });
            const player = createAudioPlayer({
                behaviors: {
                    noSubscriber: NoSubscriberBehavior.Play
                }
            });

            connection.subscribe(player);
            player.play(resource);

            player.on(AudioPlayerStatus.Playing, () => {
                console.log('El bot está reproduciendo el audio.');
            });

            player.on(AudioPlayerStatus.Idle, () => {
                console.log('El audio ha terminado.');
                if (!connection.destroy) {
                    connection.destroy();
                }
            });

            player.on('error', error => {
                console.error('Error al reproducir música:', error);
                connection.destroy();
                interaction.followUp({ content: 'Hubo un problema al intentar reproducir la música.', ephemeral: true });
            });

            return await interaction.reply(`🎶 Reproduciendo ahora: ${info.videoDetails.title}`);
        } catch (error) {
            console.error('Error al reproducir música:', error);
            connection.destroy();
            return await interaction.reply({ content: 'Hubo un problema al intentar reproducir la música.', ephemeral: true });
        }
    } else {
        await interaction.reply({ content: 'El miembro no es un miembro de un servidor.', ephemeral: true });
        return;
    }
}
