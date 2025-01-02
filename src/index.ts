import { deployCommands } from './commands/deploy-commands';
import { getClient } from './services/client.service';
import { commands } from './commands/cmd-hub';
import { Routes } from 'discord-api-types/v9';
import { REST } from '@discordjs/rest';
import { Events } from 'discord.js';
import { config } from './config';

/**
 * 
 * 
 * CONFIGURACION INCIAL DEL BOT
 * 
 * 
 */

const client = getClient();

/**
 * 
 * 
 * CARGA Y REGISTRO DE LOS COMANDOS SLASH EN EL SERVIDOR
 * 
 * 
 */

for (const key in commands) {
    const command = commands[key as keyof typeof commands];
    if ("data" in command && "execute" in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.error(
            `[WARNING] El comando "${key}" no tiene las propiedades "data" o "execute".`
        );
    }
}

const registerCommands = async () => {
    const clientId = config.DISCORD_CLIENT_ID;
    const commandsArray = Object.values(commands).map((command: any) => command.data.toJSON());
    const rest = new REST({ version: '9' }).setToken(config.DISCORD_TOKEN);

    try {
        console.log('Comenzando el registro de comandos...');

        await rest.put(Routes.applicationCommands(clientId), {
            body: commandsArray,
        });

        console.log('Comandos registrados correctamente.');
    } catch (error) {
        console.error('Error al registrar comandos:', error);
    }
};
registerCommands();

/**
 *
 * 
 * INICIO DE SESION DEL BOT (CLIENTE)
 * 
 * 
 */

client.once(Events.ClientReady, () => {
    console.log(`Sesion iniciada como ${client.user?.tag}`);
});

/**
 * 
 * 
 * REGISTRO DE EVENTO INTERACTIVOS
 * 
 * 
 */

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isCommand()) return;

    if (interaction.replied || interaction.deferred) {
        console.log("Ya se respondió a esta interacción.");
        return;
    }

    const command = client.commands.get(interaction.commandName);
    if (!command) {
        console.error(`Comando no encontrado: ${interaction.commandName}`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(`Error ejecutando el comando "${interaction.commandName}":`, error);
        await interaction.reply({
            content: "Hubo un error al ejecutar este comando.",
            ephemeral: true,
        });
    }
});

client.on("guildCreate", async (guild) => {
    await deployCommands({ guildId: guild.id });
});

process.on("uncaughtException", (error) => {
    console.error("Error no capturado:", error);
});

process.on("unhandledRejection", (reason) => {
    console.error("Promesa rechazada sin manejar:", reason);
});


/**
 * 
 * 
 * SESION DE CONEXION DEL BOT (SERVIDOR)
 * 
 * 
 */

client.login(config.DISCORD_TOKEN);