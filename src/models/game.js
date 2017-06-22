import { getDate } from '../resources/elements/utility';

export class Game {
  constructor(game) {
    Object.assign(this, game);
    this.gameStartDate = getDate(this.gameStartTime);
  }
}
