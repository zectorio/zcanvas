
import Shape from '../shape'
import zdom from 'zdom'
import {Transform} from 'zmath'

class CanvasShape extends Shape {

  constructor(pathdef, style, transform=Transform.IDENTITY, callbacks) {
    super(pathdef, style, transform, callbacks);
    this._transformstr = this.transform.toAttributeString();

  }

  updateStyle(style) {
    super.updateStyle(style);
  }

  setTransform(transform) {
    super.setTransform(transform);
    this._transformstr = this.transform.toAttributeString();
  }

  _applyStyle() {
    for(let key in this.style) {
      if(key === 'stroke') {
        this._ctx.strokeStyle = this.style.stroke;
      } else if(key === 'fill') {
        this._ctx.fillStyle = this.style.fill;
      } else if(key === 'strokeWidth') {
        this._ctx.lineWidth = this.style.strokeWidth;
      }
    }
  }

  _paint() {
    if(this.style.hasOwnProperty('stroke')) {
      this._ctx.stroke();
    }
    if(this.style.hasOwnProperty('fill')) {
      this._ctx.fill();
    }
  }

  _initCanvas() {
    this._canvas = zdom.createCanvas();
    this._canvas.width = this.backend.width;
    this._canvas.height = this.backend.height;
    this._ctx = this._canvas.getContext('2d');
  }

  render() {

    if(!this._canvas) {
      this._initCanvas();
    }

    if(this.pathdef.startsWith('CIRCLE')) {
      let [_,cx,cy,r] = this.pathdef.split(/[\s,]/).map(s => parseFloat(s));
      this._ctx.arc(cx,cy, r, 0, 2*Math.PI);
    } else if(this.pathdef.startsWith('ELLIPSE')) {
    } else if(this.pathdef.startsWith('RECT')) {
    } else {
    }

    this._applyStyle();
    this._paint();
    super.render();
  }
}

export default CanvasShape;