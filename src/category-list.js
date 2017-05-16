import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {WebAPI} from './web-api';
import {GameViewed} from './messages';

@inject(WebAPI, EventAggregator)
export class CategoryList {
  constructor(api, ea) {
    this.api = api;
    this.ea = ea;

    this.categories = []
  }

  activate(params, routeConfig) {
    this.routeConfig = routeConfig;

    return this.api.getGameCategories(params.gameId).then(categories => {
      this.categories = categories;
      this.ea.publish(new GameViewed(null)); // need the game reference!
    });
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
