
import Gradient from './gradbase'
import GradientStopList from './gradstoplist'

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


