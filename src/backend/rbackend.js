
class RenderBackend {

  /**
   * @param {number} width
   * @param {number} height
   */
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this._items = [];
    this._idCounter = 0;
    this._needsRedraw = true;
  }

  /**
   * Register item to this canvas backend, by assigning a new id to it
   * and tracking it
   * @param item
   */
  register(item) {
    let id = this._generateId();
    this._items[id] = item;
    item._assignId(id);
  }

  _generateId() {
    return this._idCounter++;
  }

  /**
   * @abstract
   */
  getDOMElement() {
    throw new Error('Not implemented');
  }

  /**
   * @abstract
   */
  root() {
    throw new Error('Not implemented');
  }

  _markDirty() {
    this._needsRedraw = true;
  }

  /**
   * Render
   */
  render() {
    this._root.render();
  }

  /**
   * Resize canvas
   * @param {number} width
   * @param {number} height
   */
  resize(width, height) {
    this.width = width;
    this.height = height;
  }

}

export default RenderBackend;
