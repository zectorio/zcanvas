/**
 * @class
 */
class Backend {

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
   * Abstract method - child class should implement it
   */
  getDOMElement() {
    throw new Error('Not implemented');
  }

  /**
   * Abstract method - child class should implement it
   */
  root() {
    throw new Error('Not implemented');
  }

  _markDirty() {
    this._needsRedraw = true;
  }

  /**
   * Start render Loop
   * If ontick callback is passed, it's invoked at every tick
   * @param {ZCanvas~ontick} [ontick]
   */
  render(onTick = null) {
    let t=null;
    let tstart=null;

    let tick = (tstamp) => {
      if(!tstart) { tstart = tstamp; }
      if(!t) { t = tstart; }

      if(this._needsRedraw) {
        this._root.render();
        this._needsRedraw = false;
      }

      let ev = {
        delta : tstamp-t,
        total : tstamp-tstart
      };
      if(onTick) {
        onTick(ev);
      }
      t = tstamp;

      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
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

export default Backend;
