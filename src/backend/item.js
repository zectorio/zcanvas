
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

  setTransform(transform) {
    this.transform = transform;
    this._markDirty();
  }

  show() {
    this._isVisible = true;
    this._markDirty();
  }

  hide() {
    this._isVisible = false;
    this._markDirty();
  }

  isVisible() {
    return this._isVisible;
  }

}

export default Item;