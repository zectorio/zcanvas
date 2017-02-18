
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

  render(onTick = null) {
    let t=null;
    let tstart=null;

    let tick = (tstamp) => {
      if(!tstart) { tstart = tstamp }
      if(t) {

        let ev = {
          delta : tstamp-t,
          total : tstamp-tstart
        };

        this.root.render();

        if(onTick) {
          onTick(ev);
        }
      }
      t = tstamp;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

}

export default Backend;
