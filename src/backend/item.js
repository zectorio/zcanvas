
class Item {
  constructor(transform) {
    this.transform = transform;
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
  }

}

export default Item;