
import Gradient from './gradbase'
import GradientStopList from './gradstoplist'

export default class RadialGradient extends Gradient {
  constructor(gradstoplist, center, radius) {
    super();
    this.stoplist = gradstoplist;
    this.center = center;
    this.radius = radius;
  }

  toMemento() {
    return {
      stoplist : this.stoplist.toMemento(),
      center : this.center,
      rx : this.rx,
      ry : this.ry,
      rotation : this.rotation
    };
  }

  clone() {
    return RadialGradient.fromMemento(this.toMemento());
  }

  toString() {
    return `radgrad center:${vec2.format(this.center)}`+
      `rx:${this.rx},ry:${this.ry} stops:${this.stoplist.toString()}`;
  }

  /**
   * Creates Canvas Radial Gradient
   * @param {CanvasRenderingContext2D} ctx
   * @returns {CanvasGradient}
   */
  toCanvas(ctx) {
    let [cx,cy] = this.center;
    let rgrad = ctx.createRadialGradient(cx,cy,0, cx,cy, this.radius);
    this.stoplist.getStops().forEach(stop => {
      rgrad.addColorStop(stop.position, stop.kolor.toCSS());
    });
    return rgrad;
  }

  static fromMemento(m) {
    return new RadialGradient(
      GradientStopList.fromMemento(m.stoplist), m.center, m.rx, m.ry, m.rotation
    );
  }
}

