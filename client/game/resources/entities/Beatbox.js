import Entity from './Entity';
import Wave from './Wave';

export default class Beatbox extends Entity {
    constructor(store) {
      super(store);
      this.sprite = new PIXI.Sprite.fromImage('assets/img/beatbox.png');
      this.sprite.width = 80;
      this.sprite.height = 80;
      this.sprite.anchor.set(0.5);
      this.sprite.position.x = 200;
      this.sprite.position.y = 200;
      this.container.addChild(this.sprite);

      setInterval(this.emitWave.bind(this), 1000);
    }
    emitWave() {
      var wave = new Wave(this.store, {
        x: this.sprite.position.x,
        y: this.sprite.position.y
      });
    }
    render() {

    }
}
