
import RenderGroup from '../rgroup'
import {vec2, AABB, Transform} from 'zmath'
import zdom from 'zdom'

const IDENTITY = Transform.identity();

class CanvasGroup extends RenderGroup {

  /**
   * @param {Transform} transform
   */
  constructor(transform) {
    super(transform);
    
  }
  
  _updateLocalCanvasParameters() {

    if(this.children.length > 0) {
      this.aabb = new AABB({});
      for(let child of this.children) {
        this.aabb.merge(child.aabb);
      }
    } else {
      this.aabb = new AABB({
        min:[0,0], max:[this.backend.width,this.backend.height]
      });
    }
    this.localWidth = this.aabb.width();
    this.localHeight = this.aabb.height();
    this.localTransform = new Transform()
      .translate(vec2.mul(this.aabb.min, -1));
    
  }
  
  add(child) {
    super.add(child);
    this._updateLocalCanvasParameters();
  }

  _initCanvas() {
    this._updateLocalCanvasParameters();
    this._canvas = zdom.createCanvas();
    this._canvas.width = this.localWidth;
    this._canvas.height = this.localHeight;
    this._ctx = this._canvas.getContext('2d');
  }

  _applyTransform() {
    if(!this.transform.isIdentity()) {
      this._ctx.transform(...this.transform.toArray());
    }
  }

  _clearCanvas() {
    this._ctx.save();
    this._ctx.setTransform(...IDENTITY.toArray());
    this._ctx.clearRect(0,0,this.localWidth, this.localHeight);
    this._ctx.restore();
  }

  _pushContext() {
    this._ctx.save();
    this._applyTransform();
  }

  _popContext() {
    this._ctx.restore();
  }

  render() {
    if(!this._canvas) {
      this._initCanvas();
    }

    if(this._isDirty()) {
      this._clearCanvas();

      super.render();

      this._pushContext();
      this.children.forEach(child => {
        if(child.isVisible()) {
          this._ctx.save();
          
          console.log('child transform', child.localTransform.toArray(), child.aabb.min,child.aabb.max);
          
          this._ctx.transform(...child.localTransform.inverse().toArray());
          this._ctx.drawImage(child._canvas,0,0);
          // this._ctx.fillStyle = '#9f9';
          // this._ctx.fillRect(0,0,child.localWidth, child.localHeight);
          
          this._ctx.restore();
        }
      });
      this._popContext();
    }
  }
}

export default CanvasGroup;