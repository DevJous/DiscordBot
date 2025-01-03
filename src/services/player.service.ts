import { Player } from "discord-player";
import { getClient } from "./client.service";
import { DefaultExtractors } from '@discord-player/extractor';
import { YoutubeiExtractor } from "discord-player-youtubei"

var player = new Player(getClient());

player.extractors.register(YoutubeiExtractor, { });
player.extractors.loadMulti([YoutubeiExtractor, ...DefaultExtractors]);

export function getPlayer(): Player {
    return player;
}