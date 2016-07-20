import { getStore } from './GameModel';
import Beatbox from './resources/entities/Beatbox';
import Player from './resources/entities/Player';

class Game {
  constructor (id) {
    this.renderer = new PIXI.autoDetectRenderer(800, 600);
    document.getElementById(id).appendChild(this.renderer.view);

    this.stage = new PIXI.Container();

    this.store = getStore();
    this.store.dispatch({type: 'addStage', data: this.stage});
    this.store.dispatch({type: 'addRenderer', data: this.renderer});

    var beatbox = new Beatbox(this.store);
    var player = new Player(this.store);

    this.render();
  }

  render() {
    var state = this.store.getState();
    state.entities.forEach((entity) => {
      // If the entity has left the screen or if it is currently
      // awaiting grabage colleciton, renderable will be set to false.
      if (entity.renderable) {
        entity.render();
      }
    });
    this.renderer.render(state.stage);
    requestAnimationFrame(this.render.bind(this));
  }
}

export default Game;
