
import RenderShape from '../rshape'
import zdom from 'zdom'
import {Transform} from 'zmath'

const IDENTITY = Transform.identity();

class CanvasShape extends RenderShape {

  /**
   * @param {ZCanvas~PathDefinition} pathdef
   * @param {ZCanvas~Style} style
   * @param {Transform} transform
   */
  constructor(pathdef, style, transform) {
    super(pathdef, style, transform);
  }

  /**
   * Updates style of this RenderShape by merging input style to it
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
    if(this.style.hasOwnProperty('fill') &&
      this.style['fill'] !== 'none')
    {
      this._ctx.fill();
    }
    if(this.style.hasOwnProperty('stroke') &&
      this.style['stroke'] !== 'none')
    {
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

  static _validateCPoints(cpoints, n) {
    if(!Array.isArray(cpoints) || cpoints.length<n) {
      throw new Error("Invalid 'cpoints' property");
    }
    for(let i=0; i<n; i++) {
      if(!Array.isArray(cpoints[i]) || cpoints[i].length<2) {
        throw new Error(`Invalid coordinate 'cpoints[${i}]'`);
      }
    }
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
          this._ctx.beginPath();
          this._ctx.moveTo(D.x1, D.y1);
          this._ctx.lineTo(D.x2, D.y2);
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
          this._ctx.beginPath();
          this._ctx.ellipse(D.cx,D.cy,D.rx,D.ry,0,0,2*Math.PI,true);
          break;
        case 'qbez':
          {

            CanvasShape._validateCPoints(D.cpoints, 3);
            this._ctx.beginPath();
            let [[x0,y0],[x1,y1],[x2,y2]] = D.cpoints;
            this._ctx.moveTo(x0,y0);
            this._ctx.quadraticCurveTo(x1,y1,x2,y2);
          }
          break;
        case 'cbez':
          {
            this._validateCPoints(D.cpoints, 4);
            this._ctx.beginPath();
            let [[x0,y0],[x1,y1],[x2,y2],[x3,y3]] = D.cpoints;
            this._ctx.moveTo(x0,y0);
            this._ctx.bezierCurveTo(x1,y1,x2,y2,x3,y3);
          }
          break;
        case 'path':
          {
            if(!Array.isArray(D.curveseq)) {
              throw new Error("Invalid 'curveseq' format");
            }
            this._ctx.beginPath();
            for(let i=0; i<D.curveseq.length; i++) {
              let curvecmd = D.curveseq[i];
              if(!Array.isArray(curvecmd)) {
                throw new Error(
                  `Invalid curve command format at 'curveseq[${i}]'`);
              }
              let verb = curvecmd[0].toUpperCase();
              switch(verb) {
                case 'M':
                  {
                    let [_,x,y] = curvecmd;
                    this._ctx.moveTo(x,y);
                  }
                  break;
                case 'L':
                  {
                    let [_,x,y] = curvecmd;
                    this._ctx.lineTo(x,y);
                  }
                  break;
                case 'Q':
                  {
                    let [_,cpx,cpy,x,y] = curvecmd;
                    this._ctx.quadraticCurveTo(cpx,cpy,x,y);
                  }
                  break;
                case 'C':
                  {
                    let [_,cp1x,cp1y,cp2x,cp2y,x,y] = curvecmd;
                    this._ctx.bezierCurveTo(cp1x,cp1y,cp2x,cp2y,x,y);
                  }
                  break;
                case 'E':
                  {
                    let [_,cx,cy,rx,ry,start,end,ccw] = curvecmd;
                    this._ctx.ellipse(cx,cy,rx,ry,0,start,end,ccw);
                  }
                  break;
                case 'Z':
                  {
                    this._ctx.closePath();
                  }
                  break;
                default:
                  throw new Error(
                    `Invalid verb in curve command 'curveseq[${i}]]'`);
              }
            }
          }
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