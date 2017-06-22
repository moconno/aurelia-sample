import {inject} from 'aurelia-framework';
import {App} from './app';
import {GameService} from './services/GameService';
import { GameViewed } from './messages';

@inject(App, GameService)
export class GameList {
  constructor(app, gameService) {
    this.app = app;
    this.gameService = gameService;
  }

  created() {
    return this.gameService.getGames();
  }

  select(game) {
    this.app.ea.publish(new GameViewed(game));
    return true;
  }
}
