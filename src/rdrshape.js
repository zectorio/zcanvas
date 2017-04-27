
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

    /**
     * Path definition
     * @type {ZCanvas~PathDefinition}
     * @private
     */
    this._validatePathDef(pathdef);
    this._pathdef = pathdef;
    
    /**
     * Style
     * @type {ZCanvas~Style}
     * @private
     */
    this._style = style || {stroke:'#000'};
    
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
    let style = this._style;
    if(style.hasOwnProperty('fill') && style['fill'] !== 'none') {
      this._ctx.fill();
    }
    if(style.hasOwnProperty('stroke') && style['stroke'] !== 'none') {
      this._ctx.stroke();
    }
  }
  
  render() {
    
    if(!this._elem) {
      this._initRenderBackend();
    }
    
    this._clearCanvas();
    
    if(this._isVisible) {
      this._pushContext();
      
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