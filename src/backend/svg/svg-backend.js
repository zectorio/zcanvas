
import zdom from 'zdom'

import Backend from '../backend'
import SVGGroup from './svg-group'

class SVGBackend extends Backend {

  constructor(width, height) {
    super(width, height);

    this._elem = zdom.createSVG(width, height);
    this._root = new SVGGroup();
    this._root._setBackend(this);
    this._root._setParent(this);

    this.register(this._root);
  }

  getDOMElement() {
    return this._elem;
  }

  root() {
    return this._root;
  }

  resize(width, height) {
    super.resize(width, height);
    zdom.set(this._elem, 'width', width);
    zdom.set(this._elem, 'height', height);
  }
}

export default SVGBackend;