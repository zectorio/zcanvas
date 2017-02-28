
import Shape from '../shape'
import zdom from 'zdom'
import {Transform} from 'zmath'

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


    if(this.isVisible()) {
      // console.log('shape render',this.id);

      this._clearCanvas();
      this._pushContext();

      if(this.pathdef.startsWith('CIRCLE')) {
        let [_,cx,cy,r] = this.pathdef.split(/[\s,]/).map(s => parseFloat(s));
        this._ctx.beginPath();
        this._ctx.arc(cx,cy, r, 0, 2*Math.PI);
      } else if(this.pathdef.startsWith('ELLIPSE')) {
      } else if(this.pathdef.startsWith('RECT')) {
        let [_,x,y,w,h,rx,ry] = this.pathdef.split(/[\s,]/).map(s => parseFloat(s));
        this._ctx.beginPath();
        this._ctx.moveTo(x,y);
        this._ctx.lineTo(x+w,y);
        this._ctx.lineTo(x+w,y+h);
        this._ctx.lineTo(x,y+h);
        this._ctx.lineTo(x,y);
        if(rx || ry) {
          console.warn('TODO: rounded rectangle');
        }
      } else {
      }

      this._paint();
      this._popContext();
    }

    super.render();
  }
}

export default CanvasShape;