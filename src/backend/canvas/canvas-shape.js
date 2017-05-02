
import RenderShape from '../rshape'
import Item from '../item'
import zdom from 'zdom'
import {vec2, AABB, Transform} from 'zmath'
import {Gradient} from '../../gradient' 

const IDENTITY = Transform.identity();

const PADDING = 5;
const TRIMMED_CANVAS = false;

class CanvasShape extends RenderShape {

  /**
   * @param {ZCanvas~PathDefinition} pathdef
   * @param {ZCanvas~Style} style
   * @param {Transform} transform
   */
  constructor(pathdef, style, transform) {
    super(pathdef, style, transform);
    
    let lineWidth;
    if(this.style.hasOwnProperty('strokeWidth')) {
      lineWidth = this.style['strokeWidth'];
    } else {
      if(this.style.hasOwnProperty('stroke') && this.style['stroke'] !== 'none')
      {
        lineWidth = 1; 
      } else {
        lineWidth = 0; 
      }
    }
    let padding = lineWidth + PADDING;
    
    if(TRIMMED_CANVAS) {
      let aabb = this._calculateAABB();
      this.canvasWidth = aabb.width() + padding;
      this.canvasHeight = aabb.height() + padding;
      this.canvasOffset = vec2.sub(aabb.min, [padding/2,padding/2]);
      this.aabb = aabb;
    } else {
    }

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
        if(this.style.fill instanceof Gradient) {
          this._ctx.fillStyle = this.style.fill.toCanvas(this._ctx);
        } else if(this.style.fill instanceof Item) {
          this.style.fill.render(false);
          this._ctx.fillStyle =
            this._ctx.createPattern(this.style.fill._canvas,'repeat');
        } else {
          this._ctx.fillStyle = this.style.fill;
        }
      } else if(key === 'strokeWidth') {
        this._ctx.lineWidth = this.style.strokeWidth;
      }
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
    this._ctx.clearRect(0,0,this.canvasWidth, this.canvasHeight);
    this._ctx.restore();
  }

  _initCanvas() {
    this._canvas = zdom.createCanvas();
    this._canvas.width = this.canvasWidth;
    this._canvas.height = this.canvasHeight;
    this._ctx = this._canvas.getContext('2d');
  }

  _pushContext() {
    this._ctx.save();
    this._applyStyle();
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
   * AABB of this shape in global coordniates
   * @returns {AABB}
   * @private
   */
  _calculateAABB() {
    let D = this.pathdef;
    switch(D.type) {
      case 'line':
        return new AABB({
          min : [Math.min(D.x1,D.x2), Math.min(D.y1,D.y2)],
          max : [Math.max(D.x1,D.x2), Math.max(D.y1,D.y2)]
        });
      case 'rect':
        return new AABB({
          min : [D.x,D.y],
          max : [D.x+D.w,D.y+D.h]
        });
      case 'circle':
        return new AABB({
          min : [D.cx-D.r, D.cy-D.r],
          max : [D.cx+D.r, D.cy+D.r]
        });
      case 'ellipse':
        return new AABB({
          min : [D.cx-D.rx, D.cy-D.ry],
          max : [D.cx+D.rx, D.cy+D.ry]
        });
        break;
      case 'qbez':
        return new AABB({
          min : vec2.low(...D.cpoints),
          max : vec2.high(...D.cpoints)
        });
        break;
      case 'cbez':
        return new AABB({
          min : vec2.low(...D.cpoints),
          max : vec2.high(...D.cpoints)
        });
        break;
      case 'path':
        let xmin = Infinity;
        let ymin = Infinity;
        let xmax = -Infinity;
        let ymax = -Infinity;
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
              xmin = Math.min(x, xmin);
              xmax = Math.max(x, xmax);
              ymin = Math.min(y, ymin);
              ymax = Math.max(y, ymax);
            }
              break;
            case 'L':
            {
              let [_,x,y] = curvecmd;
              xmin = Math.min(x, xmin);
              xmax = Math.max(x, xmax);
              ymin = Math.min(y, ymin);
              ymax = Math.max(y, ymax);
            }
              break;
            case 'Q':
            {
              let [_,cpx,cpy,x,y] = curvecmd;
              xmin = Math.min(x, cpx, xmin);
              xmax = Math.max(x, cpx, xmax);
              ymin = Math.min(y, cpy, ymin);
              ymax = Math.max(y, cpy, ymax);
            }
              break;
            case 'C':
            {
              let [_,cp1x,cp1y,cp2x,cp2y,x,y] = curvecmd;
              xmin = Math.min(x, cp1x, cp2x, xmin);
              xmax = Math.max(x, cp1x, cp2x, xmax);
              ymin = Math.min(y, cp1y, cp2y, ymin);
              ymax = Math.max(y, cp1y, cp2y, ymax);
            }
              break;
            case 'E':
            {
              let [_,cx,cy,rx,ry,start,end,ccw] = curvecmd;
              xmin = Math.min(cx-rx, xmin);
              xmax = Math.max(cx+rx, xmax);
              ymin = Math.min(cy-ry, ymin);
              ymax = Math.max(cy+ry, ymax);
            }
              break;
            case 'Z':
            {
            }
              break;
            default:
              throw new Error(
                `Invalid verb in curve command 'curveseq[${i}]]'`);
          }
        }
        return new AABB({
          min : [xmin,ymin], max : [xmax,ymax]
        });
      default:
        throw new Error('Not implemented');
    }
  }
  
  _toLocalCanvas(coord) {
    return vec2.sub(coord, this.canvasOffset); 
  }

  /**
   * Render
   */
  render(withpadding=true) {
    
    if(TRIMMED_CANVAS) {
      if(!withpadding) {
        this.canvasWidth = this.aabb.width();
        this.canvasHeight = this.aabb.height();
        this.canvasOffset = [0,0];
      }
    } else {
      this.canvasWidth = this.backend.width;
      this.canvasHeight = this.backend.height;
      this.canvasOffset = [0,0];
      this.aabb = {min:[0,0], max:[this.backend.width,this.backend.height]};
    }

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
          this._ctx.moveTo(...this._toLocalCanvas([D.x1, D.y1]));
          this._ctx.lineTo(...this._toLocalCanvas([D.x2, D.y2]));
          break;
        case 'rect':
          this._ctx.beginPath();
          this._ctx.moveTo(...this._toLocalCanvas([D.x,D.y]));
          this._ctx.lineTo(...this._toLocalCanvas([D.x+D.w,D.y]));
          this._ctx.lineTo(...this._toLocalCanvas([D.x+D.w,D.y+D.h]));
          this._ctx.lineTo(...this._toLocalCanvas([D.x,D.y+D.h]));
          this._ctx.lineTo(...this._toLocalCanvas([D.x,D.y]));
          this._ctx.closePath();
          if(D.rx || D.ry) {
            console.warn('TODO: rounded rectangle');
          }
          break;
        case 'circle':
          this._ctx.beginPath();
          this._ctx.arc(...this._toLocalCanvas([D.cx,D.cy]), D.r, 0, 2*Math.PI);
          break;
        case 'ellipse':
          this._ctx.beginPath();
          this._ctx.ellipse(
            ...this._toLocalCanvas([D.cx,D.cy]),D.rx,D.ry,0,0,2*Math.PI,true);
          break;
        case 'qbez':
          {
            CanvasShape._validateCPoints(D.cpoints, 3);
            this._ctx.beginPath();
            let [[x0,y0],[x1,y1],[x2,y2]] = D.cpoints;
            this._ctx.moveTo(...this._toLocalCanvas([x0,y0]));
            this._ctx.quadraticCurveTo(
              ...this._toLocalCanvas([x1,y1]),
              ...this._toLocalCanvas([x2,y2]));
          }
          break;
        case 'cbez':
          {
            CanvasShape._validateCPoints(D.cpoints, 4);
            this._ctx.beginPath();
            let [[x0,y0],[x1,y1],[x2,y2],[x3,y3]] = D.cpoints;
            this._ctx.moveTo(...this._toLocalCanvas([x0,y0]));
            this._ctx.bezierCurveTo(
              ...this._toLocalCanvas([x1,y1]),
              ...this._toLocalCanvas([x2,y2]),
              ...this._toLocalCanvas([x3,y3])
            );
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
                    this._ctx.moveTo(...this._toLocalCanvas([x,y]));
                  }
                  break;
                case 'L':
                  {
                    let [_,x,y] = curvecmd;
                    this._ctx.lineTo(...this._toLocalCanvas([x,y]));
                  }
                  break;
                case 'Q':
                  {
                    let [_,cpx,cpy,x,y] = curvecmd;
                    this._ctx.quadraticCurveTo(
                      ...this._toLocalCanvas([cpx,cpy]),
                      ...this._toLocalCanvas([x,y]));
                  }
                  break;
                case 'C':
                  {
                    let [_,cp1x,cp1y,cp2x,cp2y,x,y] = curvecmd;
                    this._ctx.bezierCurveTo(
                      ...this._toLocalCanvas([cp1x,cp1y]),
                      ...this._toLocalCanvas([cp2x,cp2y]),
                      ...this._toLocalCanvas([x,y]));
                  }
                  break;
                case 'E':
                  {
                    let [_,cx,cy,rx,ry,start,end,ccw] = curvecmd;
                    this._ctx.ellipse(...this._toLocalCanvas([cx,cy]),
                      rx,ry,0,start,end,ccw);
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