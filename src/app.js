import {EventAggregator} from 'aurelia-event-aggregator';
import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client'

@inject(HttpClient, EventAggregator)
export class App {
  constructor(http, ea, utility) {
    this.http = http;
    this.ea = ea;
  }

  configureRouter(config, router) {
    config.title = 'Home';
    config.map([
      { route: '', moduleId: 'game-list', title: 'Games' },
      { route: 'game/:gameId/categories', moduleId: 'category-list', name: 'gameCategories', title: 'Categories', activate: true}
      { route: 'game/:gameId/category/:categoryId', moduleId: 'checkout', name: 'checkoutCategory', title: 'Checkout', activate: true}

    ]);

    this.router = router;
  }
}
