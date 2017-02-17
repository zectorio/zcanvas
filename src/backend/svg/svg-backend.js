
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

    this._items[this._idCounter] = this.root;
    this.root._assignId(this._idCounter);
    this._idCounter++;
  }

  getDOMElement() {
    return this.elem;
  }

  getRoot() {
    return this.root;
  }

  render(eachFrameCallback = null) {
    let draw = () => {
      this.root.render();
      if(eachFrameCallback) {
        eachFrameCallback();
      }
      requestAnimationFrame(draw);
    };
    draw();
  }
}

export default SVGBackend;