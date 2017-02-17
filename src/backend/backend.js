
import Group from './group';

class Backend {

  constructor(width, height) {
    this.width = width;
    this.height = height;
    this._items = [];
    this._idCounter = 0;
  }

  register(item) {
    let id = this.generateId();
    this._items[id] = item;
    item._assignId(id);
  }

  generateId() {
    return this._idCounter++;
  }

  getDOMElement() {
    throw new Error('Not implemented');
  }

  getRoot() {
    throw new Error('Not implemented');
  }

  render(eachFrameCallback=null) {
    throw new Error('Not implemented');
  }

}

export default Backend;
