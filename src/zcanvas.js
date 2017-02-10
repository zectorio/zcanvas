
class ZCanvas {

  constructor(canvasDom) {
    this.width = canvasDom.width;
    this.height = canvasDom.height;

    this.layers = [];
  }


  getLayer(index) {

  }


  render(eachFrameCallback=null) {

    function draw() {

      if(eachFrameCallback) { eachFrameCallback(); }
      requestAnimationFrame(draw);

    }


  }
}

export default ZCanvas;
