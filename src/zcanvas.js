
import Layer from './layer'

class ZCanvas {

  constructor(canvasDom) {
    this.elem = canvasDom;
    this.width = canvasDom.width;
    this.height = canvasDom.height;
    this.ctx = this.elem.getContext('2d');

    this.layers = [];

    this.layers.push(new Layer(this));
  }

  getLayer(index=0) {
    return this.layers[index];
  }

  render(eachFrameCallback=null) {

    let draw = () => {
      this.ctx.clearRect(0,0,this.width,this.height);

      this.layers.forEach(layer => layer.render());

      if(eachFrameCallback) { eachFrameCallback(); }
      requestAnimationFrame(draw);
    };

    draw();

  }
}

export default ZCanvas;
