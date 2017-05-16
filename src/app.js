import {inject} from 'aurelia-framework';
import {WebAPI} from './web-api';

@inject(WebAPI)
export class App {
  constructor(api) {
    this.api = api;
  }

  configureRouter(config, router) {
    config.title = 'Games';
    config.map([
      { route: '', moduleId: 'no-selection', title: 'Select'},
      { route: 'games/:gameId/categories', moduleId: 'category-list', name: 'gameCategories'}
    ]);

    this.router = router;
  }
}
