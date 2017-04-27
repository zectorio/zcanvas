
import RenderItem from './rdritem'

export default class RenderGroup extends RenderItem {
  
  constructor(transform) {
    super(transform)
    
  }

  /**
   * @param {RenderItem} child
   */
  add(child) {
    
  }
  
  _clearCanvas() {
    this._ctx.save();
    this._ctx.setTransform(1,0,0,1,0,0); // Identity
    this._ctx.clearRect(0,0,this._width, this._height);
    this._ctx.restore();
  }

  _pushContext() {
    this._ctx.save();
    this._applyTransform();
  }

  _popContext() {
    this._ctx.restore();
  }
}