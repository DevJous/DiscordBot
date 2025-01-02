import { BotClient } from "../models/BotClient.model";

var client = new BotClient({
    intents: 53608447
});

// export function setClient(client_data: BotClient): void {
//     client = client_data
// }

export function getClient(): BotClient {
    return client;
}