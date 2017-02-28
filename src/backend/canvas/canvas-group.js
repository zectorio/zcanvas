
import Group from '../group'
import {Transform} from 'zmath'
import zdom from 'zdom'

class CanvasGroup extends Group {

  constructor(transform=Transform.IDENTITY) {
    super(transform);
  }

  _initCanvas() {
    this._canvas = zdom.createCanvas();
    this._canvas.width = this.backend.width;
    this._canvas.height = this.backend.height;
    this._ctx = this._canvas.getContext('2d');
  }

  _applyTransform() {
    if(!this.transform.isIdentity()) {
      this._ctx.transform(...this.transform.toArray());
    }
  }

  _clearCanvas() {
    this._ctx.save();
    this._ctx.setTransform(...Transform.IDENTITY.toArray());
    this._ctx.clearRect(0,0,this.backend.width, this.backend.height);
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
      if(this.isVisible()) {

        super.render();

        this._pushContext();
        this.children.forEach(child => {
          this._ctx.drawImage(child._canvas,0,0);
        });
        this._popContext();
      }
    }
  }
}

export default CanvasGroup;