
import Shape from '../shape'
import zdom from 'zdom'
import {Transform} from 'zmath'

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

  constructor(pathdef, style, transform=Transform.IDENTITY, callbacks) {
    super(pathdef, style, transform, callbacks);

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

  render() {
    if(!this.elem) {
      if(this.pathdef.startsWith('CIRCLE')) {
        let [_,cx,cy,r] = this.pathdef.split(/[\s,]/).map(s => parseFloat(s));
        this.elem = zdom.createCircle(cx,cy,r,this._stylestr);
      } else if(this.pathdef.startsWith('ELLIPSE')) {
        let [_,cx,cy,rx,ry] = this.pathdef.split(/[\s,]/).map(s => parseFloat(s));
        this.elem = zdom.createEllipse(cx,cy,rx,ry,this._stylestr);
      } else if(this.pathdef.startsWith('RECT')) {
        let [_,x,y,w,h,rx,ry] = this.pathdef.split(/[\s,]/).map(s => parseFloat(s));
        this.elem = zdom.createRect(x,y,w,h,rx||0,ry||0,this._stylestr);
      } else {
        this.elem = zdom.createPath(this.pathdef, this._stylestr);
      }
      zdom.set(this.elem, 'transform', this._transformstr);
      zdom.id(this.elem, `zci${this.id}`);
      zdom.add(this.parent.elem, this.elem);
    } else {
      if(this.pathdef.startsWith('CIRCLE')) {
        let [_,cx,cy,r] = this.pathdef.split(/[\s,]/).map(s => parseFloat(s));
        zdom.set(this.elem, 'cx', cx);
        zdom.set(this.elem, 'cy', cy);
        zdom.set(this.elem, 'r', r);
      } else if(this.pathdef.startsWith('ELLIPSE')) {
        let [_,cx,cy,rx,ry] = this.pathdef.split(/[\s,]/).map(s => parseFloat(s));
        zdom.set(this.elem, 'cx', cx);
        zdom.set(this.elem, 'cy', cy);
        zdom.set(this.elem, 'rx', rx);
        zdom.set(this.elem, 'ry', ry);
      } else if(this.pathdef.startsWith('RECT')) {
        let [_,x,y,w,h,rx,ry] = this.pathdef.split(/[\s,]/).map(s => parseFloat(s));
        zdom.set(this.elem, 'x', x);
        zdom.set(this.elem, 'y', y);
        zdom.set(this.elem, 'w', w);
        zdom.set(this.elem, 'h', h);
        zdom.set(this.elem, 'rx', rx||0);
        zdom.set(this.elem, 'ry', ry||0);
      } else {
        zdom.set(this.elem, 'd', this.pathdef);
      }
      zdom.set(this.elem, 'style', this._stylestr);
      zdom.set(this.elem, 'transform', this._transformstr);
    }


    this._markClean();
  }
}

export default SVGShape;