
import Group from '../group'
import {Transform} from 'zmath'
import zdom from 'zdom'

class SVGGroup extends Group {

  constructor(transform=Transform.IDENTITY) {
    super(transform);
    this._transformstr = this.transform.toAttributeString();
  }

  add(child) {
    super.add(child);
  }

  setTransform(transform) {
    super.setTransform(transform);
    this._transformstr = this.transform.toAttributeString();
  }

  render() {
    if(!this.elem) {
      this.elem = zdom.createG();
      zdom.id(this.elem, `zci${this.id}`);
      zdom.add(this.parent.elem, this.elem);
    }
    zdom.set(this.elem, 'transform', this._transformstr);
    super.render();
  }
}

export default SVGGroup;