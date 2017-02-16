
import choice from './backend'

class ZCanvas {

  constructor(backend='svg') {
    let {Backend,Group,Shape} = choice(backend);
    this.backend = new Backend();
    this.Group = Group;
    this.Shape = Shape;
  }

  getRoot() {
    return this.backend.getRoot();
  }

  render(eachFrameCallback=null) {

  }
}

export default ZCanvas;
