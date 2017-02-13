
import {geom} from 'zmath'

class Shape {

  constructor({curves, style, callbacks}) {
    this.curves = curves;
    this.style = style;
    this.callbacks = callbacks;
  }

  render(ctx) {
    for(let curve of this.curves) {

      // ctx.save();

      if(curve instanceof geom.Line) {

        let line = curve;
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(...line.start);
        ctx.lineTo(...line.end);
        ctx.stroke();

      }

      // ctx.restore();
    }
  }
}

export default Shape;