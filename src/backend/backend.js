
import Group from './group';

class Backend {

  constructor() {
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
