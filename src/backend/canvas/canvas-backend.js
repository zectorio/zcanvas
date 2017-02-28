
import zdom from 'zdom'
import Backend from '../backend'
import CanvasGroup from './canvas-group'

class CanvasBackend extends Backend {

  constructor(width, height) {
    super(width, height);

    this._elem = zdom.createCanvas(width, height);
    this._root = new CanvasGroup();
    this._root._setBackend(this);
    this._root._setParent(this);

    this._root._initCanvas();

    this.register(this._root);
  }

  getDOMElement() {
    return this._root._canvas;
  }

  root() {
    return this._root;
  }

}

export default CanvasBackend;
