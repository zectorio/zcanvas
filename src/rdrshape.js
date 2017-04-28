
import RenderItem from './rdritem'
import {Gradient} from './gradient'

export default class RenderShape extends RenderItem {

  /**
   * @param {ZCanvas~PathDefinition} pathdef
   * @param {ZCanvas~Style} style
   * @param {Transform} transform
   */
  constructor(pathdef, style, transform) {
    super(transform);

    this._validatePathDef(pathdef);
    /**
     * Path definition
     * @type {ZCanvas~PathDefinition}
     * @private
     */
    this._pathdef = pathdef;
    
    /**
     * Style
     * @type {ZCanvas~Style}
     * @private
     */
    this._style = style || {stroke:'#000'};

    /**
     * Transformed Path Definition
     * @type {ZCanvas~PathDefinition}
     * @private
     */
    this._xpathdef = null;

    /**
     * Transformed Style
     * @type {ZCanvas~Style}
     * @private
     */
    this._xstyle = null;
    
    this._markDirty();
  }

  /**
   * @param {ZCanvas~PathDefinition} D
   * @private
   */
  _validatePathDef(D) {
    switch(D.type) {
      case 'rect':
        if(
          !D.hasOwnProperty('x') ||
          !D.hasOwnProperty('y') ||
          !D.hasOwnProperty('w') ||
          !D.hasOwnProperty('h')
        ) {
          throw new Error('PathDef incomplete');
        }
        break;
      case 'circle':
        if(
          !D.hasOwnProperty('cx') ||
          !D.hasOwnProperty('cy') ||
          !D.hasOwnProperty('r')
        ) {
          throw new Error('PathDef incomplete');
        }
        break;
      default:
        throw new Error('Unknown PathDef type');
    }

  }

  _applyTransform() {
    let D = this.pathdef;
    let style = this.style;
    let xD, xstyle;

    let xform = this._canvas._viewTransform.inverse().mul(this._transform);
    
    // Apply transform to some of the style attributes
    let styleUpdate = {};
    if(this._hasStroke()) {
      let strokeWidth = 1;
      if(style.hasOwnProperty('strokeWidth')) {
        strokeWidth = style['strokeWidth'];
      }
      styleUpdate = { strokeWidth : strokeWidth * xform.getScale()[0] };
    }
    xstyle = Object.assign(style, styleUpdate);
    
    // Apply transform to path definition
    switch(D.type) {
      case 'rect':
        let [xx,xy] = xform.transformPoint([D.x,D.y]);
        let scale = xform.getScale()[0];
        break;
      case 'circle':
        break;
      default:
        throw new Error('Not implemented');
    }
    
    this._xpathdef = xD;
    this._xstyle = xstyle;
  }
  
  _hasFill() {
    let style = this._style;
    return style.hasOwnProperty('fill') && style['fill'] !== 'none';
  }
  
  _hasStroke() {
    let style = this._style;
    return style.hasOwnProperty('stroke') && style['stroke'] !== 'none';
  }
  
  _applyStyle() {
    let style = this._style;
    for(let key in style) {
      if(key === 'stroke') {
        this._ctx.strokeStyle = style.stroke;
      } else if(key === 'fill') {
        if(style.fill instanceof Gradient) {
          this._ctx.fillStyle = style.fill.toCanvas(this._ctx);
        } else if(style.fill instanceof RenderItem) {
          style.fill.render(false);
          this._ctx.fillStyle =
            this._ctx.createPattern(style.fill._canvas,'repeat');
        } else {
          this._ctx.fillStyle = style.fill;
        }
      } else if(key === 'strokeWidth') {
        this._ctx.lineWidth = style.strokeWidth;
      }
    }
  }

  _paint() {
    if(this._hasFill()) {
      this._ctx.fill();
    }
    if(this._hasStroke()) {
      this._ctx.stroke();
    }
  }
  
  _drawPath() {
    let D = this._pathdef;
    switch(D.type) {
      case 'rect':
        this._ctx.rect(D.x,D.y,D.w,D.h);
        break;
      case 'circle':
        this._ctx.beginPath();
        this._ctx.arc(D.cx,D.cy, D.r, 0, 2*Math.PI);
        this._ctx.closePath();
        break;
    }
  }

  render() {
    
    if(!this._elem) {
      this._initRenderBackend();
    }
    
    this._clearCanvas();
    
    if(this._isVisible) {
      this._pushContext();

      this._applyTransform();
      this._applyStyle();
      
      this._drawPath();
      
      this._paint();
      
      this._popContext();
    }
    
    this._markClean();
  }
  
  toMemento() {
    return {
      pathdef : JSON.parse(JSON.stringify(this._pathdef)),
      style : JSON.parse(JSON.stringify(this._style)),
      transform : this._transform.clone()
    }
  }

  /**
   * @param m
   * @returns {RenderShape}
   */
  static fromMemento(m) {
    return new RenderShape(m.pathdef, m.style, m.transform); 
  }

  /**
   * @returns {RenderShape}
   */
  clone() {
    return RenderShape.fromMemento(this.toMemento());
  }
  
}