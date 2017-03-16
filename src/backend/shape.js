
import Item from './item'

class Shape extends Item {

  constructor(pathdef, style, transform) {
    super(transform);
    this.pathdef = pathdef;
    this.style = style;
    this._markDirty();
  }

  updateStyle(style) {
    this.style = Object.assign(this.style, style);
    this._markDirty();
    this.parent._markDirty();
  }

  render() {
    this._markClean();
  }
}

export default Shape;