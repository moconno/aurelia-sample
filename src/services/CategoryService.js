import {inject} from 'aurelia-framework';
import {Factory} from 'aurelia-framework';
import {App} from '../app';
import {Game} from '../models/game'

@inject(App)
export class CategoryService {
  constructor(app) {
    this.app = app;
    this.categoriesByGame = {};
  }

  getCategories(gameId) {
    if (this.categoriesByGame[gameId]) {
      return this.categoriesByGame[gameId];
    }

    return this.app.http.fetch(`v2/game/${gameId}/categories`)
      .then(response => response.json())
      .then(data => {
        this.categoriesByGame[gameId] = data.categories;
        return this.categoriesByGame[gameId];
      });
  }
}
