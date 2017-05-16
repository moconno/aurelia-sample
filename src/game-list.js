import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {WebAPI} from './web-api';
import {GameViewed} from './messages';

@inject(WebAPI, EventAggregator)
export class GameList {
  constructor(api, ea) {
    this.api = api;
    this.ea = ea;
    this.games = [];

    ea.subscribe(GameViewed, msg => this.select(msg.game));
  }

  created() {
    this.games = window.loadInfo.games;
    // this.api.getContactList().then(contacts => this.contacts = contacts);
  }

  select(game) {
    this.selectedId = game.id;
    return true;
  }
}
