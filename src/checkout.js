import {App} from './app';
import {inject} from 'aurelia-framework';
import {CategoryViewed} from './messages';

@inject(App)
export class Checkout {
  constructor(app) {
    this.app = app;

    app.ea.subscribe(CategoryViewed, msg => this.select(msg.category));
  }

  activate(params, routeConfig) {
    var self = this;
    this.routeConfig = routeConfig;
    var gameId = params.gameId;
    this.gameText = params.text;


    return this.app.http.fetch(`v2/game/${gameId}/categories`)
      .then(response => response.json())
      .then(data => {
        self.categories = data.categories;
      });
  }

  getDate() {
    return new Date();
  }

  select(category) {
    this.selectedCatId = category.id;
    return true;
  }

  buy() {
    const selectedCat = this.categories.find((c) => c.id == this.selectedCatId);
    alert(`Bought that ${selectedCat.name}`);
  }
}
