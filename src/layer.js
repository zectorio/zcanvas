
class Layer {

  constructor(zcanvas) {
    this.zcanvas = zcanvas;

    this.elem = document.createElement('canvas');
    this.elem.width = this.zcanvas.width;
    this.elem.height = this.zcanvas.height;

    this.ctx = this.elem.getContext('2d');

    this.shapes = [];
  }

  addShape(shape) {
    this.shapes.push(shape);
  }

  removeShape(shape) {
    let idx = this.shapes.indexOf(shape);
    if(idx >= 0) {
      this.shapes.splice(idx, 1);
    } else {
      throw new Error("Shape not found", shape);
    }
  }

  render() {
    this.ctx.clearRect(0,0,this.zcanvas.width,this.zcanvas.height);
    for(let shape of this.shapes) {
      shape.render(this.ctx); // TODO : use shape film
    }
    this.zcanvas.ctx.drawImage(
      this.elem, 0,0, this.zcanvas.width, this.zcanvas.height);
  }
}

export default Layer;
