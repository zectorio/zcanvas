
import {Transform} from 'zmath'

export default class RenderItem {

  /**
   * @param {Transform} [transform]
   */
  constructor(transform) {
    this.transform = transform || new Transform();

    /**
     * @type {RenderGroup}
     * @private
     */
    this._parent = null;

    /**
     * @type {DOMElement}
     * @private
     */
    this._elem = null;

    /**
     * @type {CanvasRenderingContext2D}
     * @private
     */
    this._ctx = null;

    /**
     * @type {boolean}
     * @private
     */
    this._isVisible = true;

    /**
     * @type {ZCanvas}
     * @private
     */
    this._canvas = null
  }
  
  getDOMElement() {
    return this._elem;
  }

  /**
   * @param {RenderGroup} group
   * @private
   */
  _setParent(group) {
    this._parent = group;
  }

  /**
   * @param {ZCanvas} canvas
   * @private
   */
  _setCanvas(canvas) {
    this._canvas = canvas;
  }

  _markDirty() {
    this._dirty = true;
    if(this._canvas) {
      this._canvas._markDirty();
    }
  }

  _markClean() {
    this._dirty = false;
  }

  _isDirty() {
    return this._dirty;
  }
  
  /**
   * Set Transform
   * @param {Transform} transform
   */
  setTransform(transform) {
    this.transform = transform;
    this._markDirty();
    if(this._parent) {
      this._parent._markDirty();
    }
  }

  /**
   * Make the item visible
   */
  show() {
    this._isVisible = true;
    this._parent._markDirty();
  }

  /**
   * Make the item invisible
   */
  hide() {
    this._isVisible = false;
    this._parent._markDirty();
  }

  /**
   * Is this item visible?
   * @returns {boolean}
   */
  isVisible() {
    return this._isVisible;
  }
}