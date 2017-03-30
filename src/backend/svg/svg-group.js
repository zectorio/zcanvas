
import Group from '../group'
import zdom from 'zdom'

/**
 * @class
 * @extends Group
 * @memberof zcanvas.backend.svg
 */
class SVGGroup extends Group {

  /**
   * @param {Transform} transform
   */
  constructor(transform) {
    super(transform);
    this._transformstr = this.transform.toAttributeString();
  }

  /**
   * Set Transform
   * @param {Transform} transform
   */
  setTransform(transform) {
    super.setTransform(transform);
    this._transformstr = this.transform.toAttributeString();
  }

  _makeVisible() {
    if(this._elem) {
      zdom.show(this._elem);
    }
  }

  _makeInvisible() {
    if(this._elem) {
      zdom.hide(this._elem);
    }
  }

  /**
   * Render
   */
  render() {
    if(!this._elem) {
      this._elem = zdom.createG();
      zdom.id(this._elem, `zci${this.id}`);
      zdom.add(this.parent._elem, this._elem);
    }
    zdom.set(this._elem, 'transform', this._transformstr);
    this.children.forEach(child => {
      if(child.isVisible()) {
        child._makeVisible();
      } else {
        child._makeInvisible();
      }
    });
    super.render();
  }
}

export default SVGGroup;