
import RenderItem from './rdritem'

export default class RenderGroup extends RenderItem {
  
  constructor(transform) {
    super(transform);

    /**
     * @type {RenderItem[]}
     * @private
     */
    this._children = [];
  }

  /**
   * 
   * @param {RenderItem} child
   * @private
   */
  _linkChild(child) {
    child._setParent(this);
    if(this._canvas) {
      RenderGroup.walk(child, item => {
        this._canvas.register(item);
        item._setCanvas(this._canvas);
      })
    }
  }

  /**
   * @param {RenderItem} child
   */
  insertAtTop(child) {
    this._children.push(child);
    this._linkChild(child);
    this._markDirty();
  }

  /**
   * @param {RenderItem} child
   */
  insertAtBottom(child) {
    this._children.unshift(child);
    this._linkChild(child);
    this._markDirty();
  }

  /**
   * @param {RenderItem} child
   * @param {RenderItem} existing If not child of this group, exception is thrown
   */
  insertBefore(child, existing) {
    throw new Error('Not implemented');
  }

  /**
   * @param {RenderItem} child
   * @param {RenderItem} existing If not child of this group, exception is thrown
   */
  insertAfter(child, existing) {
    throw new Error('Not implemented');
  }
  
  render() {
    if(!this._elem) {
      this._initRenderBackend(); 
    }
    
    if(this._isDirty()) {
      this._clearCanvas();
      
      
      this._pushContext();
      for(let child of this._children) {
        
        if(child.isVisible()) {
          this._ctx.save();

          child.render();
          this._ctx.drawImage(child._elem, 0, 0);
          
          this._ctx.restore();
        }
      }
      this._popContext();
    }
  }
  
  
  /**
   * Walk nodes under this group recursively
   * @static
   * @param {Item} node
   * @param {function(Item)} callback
   */
  static walk(node, callback) {
    let step = n => {
      if(n instanceof RenderGroup) {
        n.children.forEach(c => step(c))
      }
      callback(n);
    };
    step(node);
  }
}