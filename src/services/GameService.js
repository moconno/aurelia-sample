import {inject} from 'aurelia-framework';
import {App} from '../app';
import {Game} from '../models/game'

@inject(App)
export class GameService {
  constructor(app) {
    this.app = app;
    this.games = [];
  }

  getGames() {
    if (this.games.length > 0) {
      return this.games;
    }

    this.app.http.isRequesting = true;
    return this.app.http.fetch('v2/game/activeGames')
      .then(response => response.json())
      .then(games => {
        for(var game of games) {
          this.games.push(new Game(game));
        }
        this.app.http.isRequesting = false;
      });
  }
}
