
import Backend from '../backend'
import SVGGroup from './svg-group'

class SVGBackend extends Backend {

  constructor() {
    super();
    this.root = new SVGGroup();
  }

  getRoot() {
    return this.root;
  }
}

export default SVGBackend;