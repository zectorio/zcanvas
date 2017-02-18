
import zdom from 'zdom'

import Backend from '../backend'
import SVGGroup from './svg-group'

class SVGBackend extends Backend {

  constructor(width, height) {
    super(width, height);

    this.elem = zdom.createSVG(width, height);
    this.root = new SVGGroup();
    this.root._setBackend(this);
    this.root._setParent(this);

    this.register(this.root);
  }

  getDOMElement() {
    return this.elem;
  }

  getRoot() {
    return this.root;
  }

}

export default SVGBackend;