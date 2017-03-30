
import zdom from 'zdom'

import Backend from '../backend'
import SVGGroup from './svg-group'

/**
 * @class
 * @extends Backend
 * @memberof zcanvas.backend.svg
 */
class SVGBackend extends Backend {

  constructor(width, height) {
    super(width, height);

    this._elem = zdom.createSVG(width, height);
    this._root = new SVGGroup();
    this._root._setBackend(this);
    this._root._setParent(this);

    this.register(this._root);
  }

  /**
   * Return SVG DOM element implementing the Canvas backend
   * @returns {Element}
   */
  getDOMElement() {
    return this._elem;
  }

  /**
   * Get root item
   * @returns {SVGGroup}
   */
  root() {
    return this._root;
  }

  /**
   * Resize
   * @param {number} width
   * @param {number} height
   */
  resize(width, height) {
    super.resize(width, height);
    zdom.set(this._elem, 'width', width);
    zdom.set(this._elem, 'height', height);
  }
}

export default SVGBackend;