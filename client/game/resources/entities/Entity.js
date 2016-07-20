// Each entity must have a container property so that it may be
// added to the stage.
export default class Entity {
    constructor(store) {
      this.store = store;
      this.container = new PIXI.Container();
      this.renderable = true;
      store.dispatch({type: 'addEntity', data: this});
    }
    destroy() {
      this.renderable = false;
      this.store.dispatch({type: 'removeEntity', data: this});
      this.container.destroy(true);
    }
    render() {
      console.error('The render method of each entity must be overridden.');
    }
}
