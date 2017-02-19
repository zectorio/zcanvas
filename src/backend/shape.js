
import Item from './item'

class Shape extends Item {

  constructor(pathdef, style, transform, callbacks) {
    super(transform);
    this.pathdef = pathdef;
    this.style = style;
    this.callbacks = callbacks;
    this._markDirty();
  }


  setPathDef(pathdef) {
    this.pathdef = pathdef;
    this._markDirty();
  }

  updateStyle(style) {
    this.style = Object.assign(this.style, style);
    this._markDirty();
  }

  setCallbacks(newCallbacks) {
    this.callbacks = Object.assign(this.callbacks, newCallbacks);
  }

  render() {
    this._markClean();
  }
}

export default Shape;