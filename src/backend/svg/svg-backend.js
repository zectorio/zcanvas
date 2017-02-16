
import zdom from 'zdom'

import Backend from '../backend'
import SVGGroup from './svg-group'

class SVGBackend extends Backend {

  constructor(width, height) {
    super(width, height);

    this.dom = zdom.createSVG(width, height);
    this.root = new SVGGroup();
  }

  getDOMElement() {
    return this.dom;
  }

  getRoot() {
    return this.root;
  }
}

export default SVGBackend;