
import choice from './backend'
import constants from './constants'

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

  resize(width, height) {
    this.backend.resize(width, height);
  }
}

ZCanvas.K = constants;

export default ZCanvas;
