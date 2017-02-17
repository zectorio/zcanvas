
import Item from './item'

class Shape extends Item {

  constructor(pathdef, style, transform, callbacks) {
    super();
    this.pathdef = pathdef;
    this.style = style;
    this.transform = transform;
    this.callbacks = callbacks;
    this._markDirty();
  }

  _markDirty() {
    this._dirty = true;
  }

  _markClean() {
    this._dirty = false;
  }

  _isDirty() {
    return this._dirty;
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

  setTransform(transform) {
    this.transform = transform;
    this._markDirty();
  }

  render() {
    throw new Error('Not implemented');
  }
}

export default Shape;