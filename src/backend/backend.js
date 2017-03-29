
class Backend {

  constructor(width, height) {
    this.width = width;
    this.height = height;
    this._items = [];
    this._idCounter = 0;
    this._needsRedraw = true;
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

  root() {
    throw new Error('Not implemented');
  }

  _markDirty() {
    this._needsRedraw = true;
  }

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

  resize(width, height) {
    this.width = width;
    this.height = height;
  }

}

export default Backend;
