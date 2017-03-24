
import Group from '../group'
import {Transform} from 'zmath'
import zdom from 'zdom'

class SVGGroup extends Group {

  constructor(transform=Transform.IDENTITY) {
    super(transform);
    this._transformstr = this.transform.toAttributeString();
  }

  setTransform(transform) {
    super.setTransform(transform);
    this._transformstr = this.transform.toAttributeString();
  }

  makeVisible() {
    if(this._elem) {
      zdom.show(this._elem);
    }
  }

  makeInvisible() {
    if(this._elem) {
      zdom.hide(this._elem);
    }
  }

  render() {
    if(!this._elem) {
      this._elem = zdom.createG();
      zdom.id(this._elem, `zci${this.id}`);
      zdom.add(this.parent._elem, this._elem);
    }
    zdom.set(this._elem, 'transform', this._transformstr);
    this.children.forEach(child => {
      if(child.isVisible()) {
        child.makeVisible();
      } else {
        child.makeInvisible();
      }
    });
    super.render();
  }
}

export default SVGGroup;