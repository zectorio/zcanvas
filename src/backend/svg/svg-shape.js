
import Shape from '../shape'
import zdom from 'zdom'
import {Transform} from 'zmath'
import K from '../../constants'

function stringifyStyle(obj) {
  let strings = [];
  for(let key of Object.keys(obj)) {
    let value = obj[key];
    // change key from camel case to hyphenated
    let hyphenKey = key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    strings.push(hyphenKey+':'+value);
  }
  return strings.join(';');
}

class SVGShape extends Shape {

  constructor(pathdef, style, transform=Transform.IDENTITY) {
    super(pathdef, style, transform);

    this._transformstr = this.transform.toAttributeString();
    this._stylestr = stringifyStyle(this.style);
  }

  updateStyle(style) {
    super.updateStyle(style);
    this._stylestr = stringifyStyle(this.style);
  }

  setTransform(transform) {
    super.setTransform(transform);
    this._transformstr = this.transform.toAttributeString();
  }

  makeVisible() {
    if(this._elem) {
      zdom.show(this._elem);
    }
  }

  makeInvisible() {
    if(this._elem) {
      zdom.hide(this._elem);
    }
  }

  render() {
    if(!this._elem) {
      let D = this.pathdef;
      switch(D.type) {
        case K.LINE:
          throw new Error('Not implemented');
          break;
        case K.RECT:
          this._elem = zdom.createRect(D.x,D.y,D.w,D.h,D.rx||0,D.ry||0,
            this._stylestr);
          break;
        case K.CIRCLE:
          this._elem = zdom.createCircle(D.cx,D.cy,D.r,this._stylestr);
          break;
        case K.ELLIPSE:
          this._elem = zdom.createEllipse(D.cx,D.cy,D.rx,D.ry,this._stylestr);
          break;
        case K.QUADBEZ:
          throw new Error('Not implemented');
          break;
        case K.CUBICBEZ:
        {
          let [[x0,y0],[x1,y1],[x2,y2],[x3,y3]] = D.cpoints;
          let pathdata = `M ${x0},${y0} C ${x1},${y1} ${x2},${y2} ${x3},${y3}`;
          this._elem = zdom.createPath(pathdata, this._stylestr);
        }
          break;
        case K.PATHSEQ:
        {
          let pathdata = '';
          for(let pathcmd of D.commands) {
            pathdata += pathcmd.join(' ');
          }
          this._elem = zdom.createPath(pathdata, this._stylestr);
        }
          break;
        default:
          throw new Error("Unknown type");
      }
      zdom.set(this._elem, 'transform', this._transformstr);
      zdom.id(this._elem, `zci${this.id}`);
      zdom.add(this.parent._elem, this._elem);
    } else {
      let D = this.pathdef;
      switch(D.type) {
        case K.LINE:
          break;
        case K.RECT:
          zdom.set(this._elem, 'x', D.x);
          zdom.set(this._elem, 'y', D.y);
          zdom.set(this._elem, 'w', D.w);
          zdom.set(this._elem, 'h', D.h);
          zdom.set(this._elem, 'rx', D.rx||0);
          zdom.set(this._elem, 'ry', D.ry||0);
          break;
        case K.CIRCLE:
          zdom.set(this._elem, 'cx', D.cx);
          zdom.set(this._elem, 'cy', D.cy);
          zdom.set(this._elem, 'r', D.r);
          break;
        case K.ELLIPSE:
          zdom.set(this._elem, 'cx', D.cx);
          zdom.set(this._elem, 'cy', D.cy);
          zdom.set(this._elem, 'rx', D.rx);
          zdom.set(this._elem, 'ry', D.ry);
          break;
        case K.QUADBEZ:
          break;
        case K.CUBICBEZ:
        {
          let [[x0,y0],[x1,y1],[x2,y2],[x3,y3]] = D.cpoints;
          let pathdata = `M ${x0},${y0} C ${x1},${y1} ${x2},${y2} ${x3},${y3}`;
          zdom.set(this._elem, 'd', pathdata);
        }
          break;
        case K.PATHSEQ:
        {
          let pathdata = '';
          for(let pathcmd of D.commands) {
            pathdata += pathcmd.join(' ');
          }
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