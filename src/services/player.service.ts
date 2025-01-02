import { Player } from "discord-player";
import { getClient } from "./client.service";
import { DefaultExtractors } from '@discord-player/extractor';

var player = new Player(getClient());
player.extractors.loadMulti(DefaultExtractors);

export function getPlayer(): Player {
    return player;
}