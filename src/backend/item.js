
class Item {
  constructor(transform) {
    this.transform = transform;
    this._isVisible = true;
  }
  _assignId(id) {
    this.id = id;
  }

  _setBackend(backend) {
    this.backend = backend;
  }

  _setParent(parent) {
    this.parent = parent;
  }

  _markDirty() {
    this._dirty = true;
    if(this.backend) {
      this.backend._setNeedsRedraw();
    }
  }

  _markClean() {
    this._dirty = false;
  }

  _isDirty() {
    return this._dirty;
  }

  setTransform(transform) {
    this.transform = transform;
    this._markDirty();
    this.parent._markDirty();
  }

  show() {
    this._isVisible = true;
    this.parent._markDirty();
  }

  hide() {
    this._isVisible = false;
    this.parent._markDirty();
  }

  isVisible() {
    return this._isVisible;
  }

}

export default Item;