
import Group from '../group'
import {Transform} from 'zmath'

class CanvasGroup extends Group {

  constructor(transform=Transform.IDENTITY) {
    super(transform);
    this._transformstr = this.transform.toAttributeString();
  }

  setTransform(transform) {
    super.setTransform(transform);
    this._transformstr = this.transform.toAttributeString();
  }

  render() {

    super.render();
  }
}

export default CanvasGroup;