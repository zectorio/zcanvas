
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
    if(!this._elem) {
      if(this.pathdef.startsWith('CIRCLE')) {
        let [_,cx,cy,r] = this.pathdef.split(/[\s,]/).map(s => parseFloat(s));
        this._elem = zdom.createCircle(cx,cy,r,this._stylestr);
      } else if(this.pathdef.startsWith('ELLIPSE')) {
        let [_,cx,cy,rx,ry] = this.pathdef.split(/[\s,]/).map(s => parseFloat(s));
        this._elem = zdom.createEllipse(cx,cy,rx,ry,this._stylestr);
      } else if(this.pathdef.startsWith('RECT')) {
        let [_,x,y,w,h,rx,ry] = this.pathdef.split(/[\s,]/).map(s => parseFloat(s));
        this._elem = zdom.createRect(x,y,w,h,rx||0,ry||0,this._stylestr);
      } else {
        this._elem = zdom.createPath(this.pathdef, this._stylestr);
      }
      zdom.set(this._elem, 'transform', this._transformstr);
      zdom.id(this._elem, `zci${this.id}`);
      zdom.add(this.parent._elem, this._elem);
    } else {
      if(this.pathdef.startsWith('CIRCLE')) {
        let [_,cx,cy,r] = this.pathdef.split(/[\s,]/).map(s => parseFloat(s));
        zdom.set(this._elem, 'cx', cx);
        zdom.set(this._elem, 'cy', cy);
        zdom.set(this._elem, 'r', r);
      } else if(this.pathdef.startsWith('ELLIPSE')) {
        let [_,cx,cy,rx,ry] = this.pathdef.split(/[\s,]/).map(s => parseFloat(s));
        zdom.set(this._elem, 'cx', cx);
        zdom.set(this._elem, 'cy', cy);
        zdom.set(this._elem, 'rx', rx);
        zdom.set(this._elem, 'ry', ry);
      } else if(this.pathdef.startsWith('RECT')) {
        let [_,x,y,w,h,rx,ry] = this.pathdef.split(/[\s,]/).map(s => parseFloat(s));
        zdom.set(this._elem, 'x', x);
        zdom.set(this._elem, 'y', y);
        zdom.set(this._elem, 'w', w);
        zdom.set(this._elem, 'h', h);
        zdom.set(this._elem, 'rx', rx||0);
        zdom.set(this._elem, 'ry', ry||0);
      } else {
        zdom.set(this._elem, 'd', this.pathdef);
      }
      zdom.set(this._elem, 'style', this._stylestr);
      zdom.set(this._elem, 'transform', this._transformstr);
    }
    if(this.isVisible()) {
      zdom.show(this._elem);
    } else {
      zdom.hide(this._elem);
    }
    super.render();
  }
}

export default SVGShape;