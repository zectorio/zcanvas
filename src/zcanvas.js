
import choice from './backend'

class ZCanvas {

  constructor(backend='svg', width, height) {
    let {Backend,Group,Shape} = choice(backend);
    this.backend = new Backend(width, height);
    ZCanvas.Group = Group;
    ZCanvas.Shape = Shape;
  }

  getDOMElement() {
    return this.backend.getDOMElement();
  }

  root() {
    return this.backend.root();
  }

  render(eachFrameCallback=null) {
    this.backend.render(eachFrameCallback);
  }
}

export default ZCanvas;
