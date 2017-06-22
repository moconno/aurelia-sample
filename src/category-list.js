import {App} from './app';
import {inject} from 'aurelia-framework';
import {CategoryService} from './services/CategoryService'
import {GameViewed, CategoryViewed} from './messages';

@inject(App, CategoryService)
export class CategoryList {
  constructor(app, categoryService) {
    this.app = app;
    this.categoryService = categoryService;
  }

  activate(params, routeConfig) {
    this.gameId = params.gameId;
    return this.getCategories();
  }

  getCategories() {
    return this.categoryService.getCategories(this.gameId);
  }

  select(category) {
    this.app.ea.publish(new CategoryViewed(category));
    return true;
  }
}
