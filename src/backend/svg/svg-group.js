
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

  render() {
    if(!this._elem) {
      this._elem = zdom.createG();
      zdom.id(this._elem, `zci${this.id}`);
      zdom.add(this.parent._elem, this._elem);
    }
    zdom.set(this._elem, 'transform', this._transformstr);
    if(this.isVisible()) {
      zdom.show(this._elem);
    } else {
      zdom.hide(this._elem);
    }
    super.render();
  }
}

export default SVGGroup;