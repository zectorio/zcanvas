
import RenderShape from '../rshape'
import {Gradient} from '../../gradient'
import zdom from 'zdom'

class SVGShape extends RenderShape {

  /**
   * @param {ZCanvas~PathDefinition} pathdef
   * @param {ZCanvas~Style} style
   * @param {Transform} transform
   */
  constructor(pathdef, style, transform) {
    super(pathdef, style, transform);

    this._transformstr = this.transform.toAttributeString();
  }

  /**
   * Updates style of this RenderShape by merging input style to it
   * @param {ZCanvas~Style} style
   */
  updateStyle(style) {
    super.updateStyle(style);
    this._stylestr = this.stringifyStyle(this.style);
  }
  
  makeStyleReference(value) {
    if(value instanceof Gradient) {
      let id = 'grad-'+this.id;
      let lingradelem = value.toDOM(id);
      zdom.add(this.backend._defs, lingradelem);
      return `url(#${id})`;
    } else {
      return value;
    }
  }
  
  stringifyStyle(obj) {
    let strings = [];
    for(let key of Object.keys(obj)) {
      let value = obj[key];
      // change key from camel case to hyphenated
      let hyphenKey = key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
      strings.push(hyphenKey+':'+this.makeStyleReference(value));
    }
    return strings.join(';');
  }

  /**
   * Set Transform
   * @param {Transform} transform
   */
  setTransform(transform) {
    super.setTransform(transform);
    this._transformstr = this.transform.toAttributeString();
  }

  _makeVisible() {
    if(this._elem) {
      zdom.show(this._elem);
    }
  }

  _makeInvisible() {
    if(this._elem) {
      zdom.hide(this._elem);
    }
  }
  
  static _pathCommandsToPathData(pathcmds) {
    let pathdata = '';
    for(let pathcmd of pathcmds) {
      if(pathcmd[0] === 'E') {
        // Ref: https://www.w3.org/TR/SVG/implnote.html#ArcImplementationNotes
        let [_,cx,cy,rx,ry,xrot,start,end,ccw] = pathcmd;
        let x = cx + rx * Math.cos(end);
        let y = cy + ry * Math.sin(end);
        
        /**
         *                                ---> cw
         *
         *
         *  (A)     T(1)        S           T(2)           E          T(3)
         *
         *     |---------------------------------------------------------|
         *     0                           PI                           2*PI
         *
         *  (B)     T(1)        E           T(2)           S          T(3)
         *
         *
         *                                <--- ccw
         */

        /**
         * large-arc-flag (fA)
         * "Of the four candidate arc sweeps, two will represent an arc sweep
         * of greater than or equal to 180 degrees (the "large-arc"), and two
         * will represent an arc sweep of less than or equal to 180 degrees
         * (the "small-arc"). If large-arc-flag is '1', then one of the two
         * larger arc sweeps will be chosen; otherwise, if large-arc-flag is
         * '0', one of the smaller arc sweeps will be chosen" - SVG Spec
         */
        let span;
        if(start < end) {
          if(ccw) {
            span = 2*Math.PI - (end-start);
          } else {
            span = end-start;
          }
        } else {
          if(ccw) {
            span = start-end;
          } else {
            span = 2*Math.PI - (start-end);
          }
        }
        let fA = span > Math.PI ? 1 : 0;

        /**
         * sweep-flag (fS)
         * "If sweep-flag is '1', then the arc will be drawn in a
         * "positive-angle" direction (i.e., the ellipse formula
         * x=cx+rx*cos(theta) and y=cy+ry*sin(theta) is evaluated such that
         * theta starts at an angle corresponding to the current point and
         * increases positively until the arc reaches (x,y)). A value of 0
         * causes the arc to be drawn in a "negative-angle" direction (i.e.,
         * theta starts at an angle value corresponding to the current point
         * and decreases until the arc reaches (x,y))." - SVG Spec
         */
        let fS = ccw ? 0 : 1;
        
        pathdata += `A ${rx},${ry} ${xrot} ${fA} ${fS} ${x},${y} `;
      } else {
        pathdata += pathcmd.join(' ')+' ';
      }
    }
    return pathdata; 
  }

  /**
   * Render
   */
  render() {
    if(!this._elem) {
      if(!this._stylestr) {
        this._stylestr = this.stringifyStyle(this.style);
      }
      let D = this.pathdef;
      switch(D.type) {
        case 'line':
          this._elem = zdom.createLine(D.x1,D.y1,D.x2,D.y2,this._stylestr);
          break;
        case 'rect':
          this._elem = zdom.createRect(D.x,D.y,D.w,D.h,D.rx||0,D.ry||0,
            this._stylestr);
          break;
        case 'circle':
          this._elem = zdom.createCircle(D.cx,D.cy,D.r,this._stylestr);
          break;
        case 'ellipse':
          this._elem = zdom.createEllipse(D.cx,D.cy,D.rx,D.ry,this._stylestr);
          break;
        case 'qbez':
        {
          let [[x0,y0],[x1,y1],[x2,y2]] = D.cpoints;
          let pathdata = `M ${x0},${y0} Q ${x1},${y1} ${x2},${y2}`;
          this._elem = zdom.createPath(pathdata, this._stylestr);
        }
          break;
        case 'cbez':
        {
          let [[x0,y0],[x1,y1],[x2,y2],[x3,y3]] = D.cpoints;
          let pathdata = `M ${x0},${y0} C ${x1},${y1} ${x2},${y2} ${x3},${y3}`;
          this._elem = zdom.createPath(pathdata, this._stylestr);
        }
          break;
        case 'path':
        {
          let pathdata = SVGShape._pathCommandsToPathData(D.curveseq);
          this._elem = zdom.createPath(pathdata, this._stylestr);
        }
          break;
        default:
          throw new Error("Unknown type");
      }
      zdom.set(this._elem, 'style', this._stylestr);
      zdom.set(this._elem, 'transform', this._transformstr);
      zdom.id(this._elem, `zci${this.id}`);
      zdom.add(this.parent._elem, this._elem);
    } else {
      let D = this.pathdef;
      switch(D.type) {
        case 'line':
          break;
        case 'rect':
          zdom.set(this._elem, 'x', D.x);
          zdom.set(this._elem, 'y', D.y);
          zdom.set(this._elem, 'w', D.w);
          zdom.set(this._elem, 'h', D.h);
          zdom.set(this._elem, 'rx', D.rx||0);
          zdom.set(this._elem, 'ry', D.ry||0);
          break;
        case 'circle':
          zdom.set(this._elem, 'cx', D.cx);
          zdom.set(this._elem, 'cy', D.cy);
          zdom.set(this._elem, 'r', D.r);
          break;
        case 'ellipse':
          zdom.set(this._elem, 'cx', D.cx);
          zdom.set(this._elem, 'cy', D.cy);
          zdom.set(this._elem, 'rx', D.rx);
          zdom.set(this._elem, 'ry', D.ry);
          break;
        case 'qbez':
          break;
        case 'cbez':
        {
          let [[x0,y0],[x1,y1],[x2,y2],[x3,y3]] = D.cpoints;
          let pathdata = `M ${x0},${y0} C ${x1},${y1} ${x2},${y2} ${x3},${y3}`;
          zdom.set(this._elem, 'd', pathdata);
        }
          break;
        case 'path':
        {
          let pathdata = SVGShape._pathCommandsToPathData(D.curveseq);
          zdom.set(this._elem, 'd', pathdata);
        }
          break;
        default:
          throw new Error('Unknown type');
      }
      zdom.set(this._elem, 'style', this._stylestr);
      zdom.set(this._elem, 'transform', this._transformstr);
    }
    super.render();
  }
}

export default SVGShape;