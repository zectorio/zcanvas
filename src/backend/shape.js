
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
    if(this.parent) {
      this.parent._markDirty();
    }
  }

  clone() {
    return new this.constructor(
      JSON.parse(JSON.stringify(this.pathdef)),
      JSON.parse(JSON.stringify(this.style)),
      this.transform.clone()
    );
  }

  render() {
    this._markClean();
  }
}

export default Shape;