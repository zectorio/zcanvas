
import Shape from '../shape'
import zdom from 'zdom'
import {Transform} from 'zmath'

const IDENTITY = Transform.identity();

/**
 * @class
 */
class CanvasShape extends Shape {

  /**
   * @param {ZCanvas~PathDefinition} pathdef
   * @param {ZCanvas~Style} style
   * @param {Transform} transform
   */
  constructor(pathdef, style, transform) {
    super(pathdef, style, transform);
  }

  /**
   * Updates style of this Shape by merging input style to it
   * @param {ZCanvas~Style} style
   */
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
    this._ctx.setTransform(...IDENTITY.toArray());
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

  /**
   * Render
   */
  render() {

    if(!this._canvas) {
      this._initCanvas();
    }

    this._clearCanvas();

    if(this.isVisible()) {

      this._pushContext();

      let D = this.pathdef;
      switch(D.type) {
        case 'line':
          break;
        case 'rect':
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
        case 'circle':
          this._ctx.beginPath();
          this._ctx.arc(D.cx,D.cy, D.r, 0, 2*Math.PI);
          break;
        case 'ellipse':
          break;
        case 'qbez':
          break;
        case 'cbez':
          break;
        case 'pathseq':
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