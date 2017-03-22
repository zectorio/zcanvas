
import Shape from '../shape'
import zdom from 'zdom'
import {Transform} from 'zmath'
import K from '../../constants'

class CanvasShape extends Shape {

  constructor(pathdef, style, transform=Transform.IDENTITY, callbacks) {
    super(pathdef, style, transform, callbacks);
  }

  updateStyle(style) {
    super.updateStyle(style);
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

  _applyTransform() {
    if(!this.transform.isIdentity()) {
      this._ctx.transform(...this.transform.toArray());
    }
  }

  _paint() {
    if(this.style.hasOwnProperty('fill')) {
      this._ctx.fill();
    }
    if(this.style.hasOwnProperty('stroke')) {
      this._ctx.stroke();
    }
  }

  _clearCanvas() {
    this._ctx.save();
    this._ctx.setTransform(...Transform.IDENTITY.toArray());
    this._ctx.clearRect(0,0,this.backend.width, this.backend.height);
    this._ctx.restore();
  }

  _initCanvas() {
    this._canvas = zdom.createCanvas();
    this._canvas.width = this.backend.width;
    this._canvas.height = this.backend.height;
    this._ctx = this._canvas.getContext('2d');
  }

  _pushContext() {
    this._ctx.save();
    this._applyStyle();
    this._applyTransform();
  }

  _popContext() {
    this._ctx.restore();
  }

  render() {

    if(!this._canvas) {
      this._initCanvas();
    }

    this._clearCanvas();

    if(this.isVisible()) {

      this._pushContext();

      let D = this.pathdef;
      switch(D.type) {
        case K.LINE:
          break;
        case K.RECT:
          this._ctx.beginPath();
          this._ctx.moveTo(D.x,D.y);
          this._ctx.lineTo(D.x+D.w,D.y);
          this._ctx.lineTo(D.x+D.w,D.y+D.h);
          this._ctx.lineTo(D.x,D.y+D.h);
          this._ctx.lineTo(D.x,D.y);
          if(D.rx || D.ry) {
            console.warn('TODO: rounded rectangle');
          }
          break;
        case K.CIRCLE:
          this._ctx.beginPath();
          this._ctx.arc(D.cx,D.cy, D.r, 0, 2*Math.PI);
          break;
        case K.ELLIPSE:
          break;
        case K.QUADBEZ:
          break;
        case K.CUBICBEZ:
          break;
        case K.PATHSEQ:
          break;
        default:
          throw new Error('Unknown type');
      }

      this._paint();
      this._popContext();
    }
    super.render();
  }
}

export default CanvasShape;