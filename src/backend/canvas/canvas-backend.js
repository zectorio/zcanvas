
import zdom from 'zdom'
import Backend from '../backend'
import CanvasGroup from './canvas-group'

class CanvasBackend extends Backend {

  constructor(width, height) {
    super(width, height);

    this.dom = zdom.createCanvas(width, height);
    this._root = new CanvasGroup();
  }

  getDOMElement() {
    return this.dom;
  }

  root() {
    return this._root;
  }

}

export default CanvasBackend;
