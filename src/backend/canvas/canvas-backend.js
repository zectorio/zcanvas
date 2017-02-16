
import zdom from 'zdom'
import Backend from '../backend'
import CanvasGroup from './canvas-group'

class CanvasBackend extends Backend {

  constructor(width, height) {
    super(width, height);

    this.dom = zdom.createCanvas(width, height);
    this.root = new CanvasGroup();
  }

  getDOMElement() {
    return this.dom;
  }

  getRoot() {
    return this.root;
  }

}

export default CanvasBackend;
