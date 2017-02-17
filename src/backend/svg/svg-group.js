
import Group from '../group'
import zdom from 'zdom'

class SVGGroup extends Group {

  add(child) {
    super.add(child);
  }

  render() {
    if(!this.elem) {
      this.elem = zdom.createG();
      zdom.id(this.elem, `zci${this.id}`);
      zdom.add(this.parent.elem, this.elem);
    }
    super.render();
  }
}

export default SVGGroup;