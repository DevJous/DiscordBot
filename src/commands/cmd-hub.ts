import * as search from './utility/music/search-music.command';
import * as play from './utility/music/play-music.command';
import * as stop from './utility/music/stop-music.command';
import * as skip from './utility/music/skip-music.command';
import * as ping from './utility/ping.command';
import * as shuffle from './utility/music/shuffle-music.command';

export const commands = {
  ping,
  play,
  stop,
  skip,
  search,
  shuffle
};
