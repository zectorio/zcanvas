
import Group from '../group'
import {Transform} from 'zmath'
import zdom from 'zdom'

class CanvasGroup extends Group {

  constructor(transform=Transform.IDENTITY) {
    super(transform);
    this._transformstr = this.transform.toAttributeString();
  }

  setTransform(transform) {
    super.setTransform(transform);
    this._transformstr = this.transform.toAttributeString();
  }

  _initCanvas() {
    this._canvas = zdom.createCanvas();
    this._canvas.width = this.backend.width;
    this._canvas.height = this.backend.height;
    this._ctx = this._canvas.getContext('2d');
  }


  render() {

    if(!this._canvas) {
      this._initCanvas();
    }

    if(this._isDirty()) {
      super.render();
      this.children.forEach(child => {
        this._ctx.drawImage(child._canvas,0,0);
      });
    }
  }
}

export default CanvasGroup;