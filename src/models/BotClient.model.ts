import { Client, Collection } from "discord.js";

export class BotClient extends Client {
    commands: Collection<string, any>;

    constructor(options: any) {
        super(options);
        this.commands = new Collection();
    }
}