
import choice from './backend'

class ZCanvas {

  constructor(backend='svg', width, height) {
    let {Backend,Group,Shape} = choice(backend);
    this.backend = new Backend(width, height);
    this.Group = Group;
    this.Shape = Shape;
  }

  getDOMElement() {
    return this.backend.getDOMElement();
  }

  getRoot() {
    return this.backend.getRoot();
  }

  render(eachFrameCallback=null) {

  }
}

export default ZCanvas;
