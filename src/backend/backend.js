
import Group from './group';

class Backend {

  constructor(width, height) {
    this.width = width;
    this.height = height;
  }

  getDOMElement() {
    throw new Error('Not implemented');
  }

  getRoot() {
    throw new Error('Not implemented');
  }

  render(eachFrameCallback=null) {
    throw new Error('Not implemented');
  }

}

export default Backend;
