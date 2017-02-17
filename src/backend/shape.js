
import Item from './item'

class Shape extends Item {

  constructor(pathdef, style, callbacks) {
    super();
    this.pathdef = pathdef;
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

  setPathDef(geometry) {
    this._markDirty();
  }

  updateStyle(key, value) {
    this._markDirty();
  }

  updateCallbacks(newCallbacks) {
  }

  render() {
    throw new Error('Not implemented');
  }
}

export default Shape;