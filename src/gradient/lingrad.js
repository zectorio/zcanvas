
import Gradient from './gradbase'
import GradientStopList from './gradstoplist'
import zdom from 'zdom'

export default class LinearGradient extends Gradient {
  constructor(gradstoplist, start, end) {
    super();
    this.stoplist = gradstoplist;
    this.start = start;
    this.end = end;
  }

  toString() {
    let [x1,y1] = this.start;
    let [x2,y2] = this.end;
    return `lingrad [${x1},${y1}] -> [${x2},${y2}]`+
      ` ${this.stoplist.toString()}`;
  }

  /**
   * Creates Canvas Linear Gradient
   * @param {CanvasRenderingContext2D} ctx
   * @returns {CanvasGradient}
   */
  toCanvas(ctx) {
    let lgrad = ctx.createLinearGradient(...this.start,...this.end);
    this.stoplist.getStops().forEach(stop => {
      lgrad.addColorStop(stop.position, stop.kolor.toCSS());
    });
    return lgrad;
  }
  
  toDOM(id) {
    let lingradelem = zdom.createSVGElement('linearGradient');
    zdom.id(lingradelem, id);
    for(let stop of this.stoplist.getStops()) {
      let stopelem = zdom.createSVGElement('stop');
      zdom.set(stopelem, 'offset', stop.position);
      zdom.set(stopelem, 'stop-color', stop.kolor.toCSSHex());
      zdom.set(stopelem, 'stop-opacity', stop.kolor.alpha());
      zdom.add(lingradelem, stopelem);
    }
    let [x1,y1] = this.start;
    let [x2,y2] = this.end;
    zdom.set(lingradelem, 'gradientUnits', 'userSpaceOnUse');
    zdom.set(lingradelem, 'x1', x1);
    zdom.set(lingradelem, 'y1', y1);
    zdom.set(lingradelem, 'x2', x2);
    zdom.set(lingradelem, 'y2', y2);
    return lingradelem;
  }
  
  clone() {
    return LinearGradient.fromMemento(this.toMemento());
  }

  toMemento() {
    return {
      stoplist : this.stoplist.toMemento(),
      start : this.start.slice(),
      end : this.end.slice()
    };
  }

  static fromMemento(m) {
    return new LinearGradient(
      GradientStopList.fromMemento(m.stoplist), m.start, m.end);
  }
}


