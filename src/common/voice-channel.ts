import { CommandInteraction, GuildMember } from 'discord.js';

export function getVoiceChannel(interaction: CommandInteraction): GuildMember['voice']['channel'] | null {
    if (interaction.member instanceof GuildMember) {
        return interaction.member.voice.channel;
    }
    return null;
}
