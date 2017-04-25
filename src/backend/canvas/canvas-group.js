
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
    this._canvasWidth = this.aabb.width();
    this._canvasHeight = this.aabb.height();
    this.localTransform = new Transform()
      .translate(vec2.mul(this.aabb.min, -1));
    
  }

  /**
   * Append child to the list of children
   * @param {Item} child - Can be RenderShape or RenderGroup
   */
  add(child) {
    super.add(child);
    // this._updateLocalCanvasParameters();
  }

  _initCanvas(width, height) {
    // this._updateLocalCanvasParameters();
    this._canvas = zdom.createCanvas();
    this._canvas.width = width || this._canvasWidth;
    this._canvas.height = height || this._canvasHeight;
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
    this._ctx.clearRect(0,0,this._canvasWidth, this._canvasHeight);
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
      for(let child of this.children) {
        if(child.isVisible()) {
          this._ctx.save();
          
          // this._ctx.transform(...child.localTransform.inverse().toArray());
          
          // let childTranslation = child.localTransform.inverse().getTranslation();

          // console.log('child', (child instanceof CanvasGroup)?'G':'S'+child.id,
          //   child.localTransform.inverse().getTranslation(),
          //   child.aabb.toString());

          this._ctx.transform(1,0,0,1,...child._canvasOffset);
          
          // console.log('child', child.id,
          //   child._canvasWidth, child._canvasHeight, child._canvasOffset);
          this._ctx.fillStyle = '#ddd';
          this._ctx.fillRect(0,0,child._canvasWidth, child._canvasHeight);
          
          this._ctx.drawImage(child._canvas,0,0);
          
          this._ctx.restore();
        }
      }
      this._popContext();
    }
  }
}

export default CanvasGroup;