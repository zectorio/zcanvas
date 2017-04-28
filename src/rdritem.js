
import {Transform} from 'zmath'
import zdom from 'zdom'

export default class RenderItem {

  /**
   * @param {Transform} [transform]
   */
  constructor(transform) {

    /**
     * @type {Transform}
     * @private
     */
    this._transform = transform || new Transform();

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

    /**
      * @type {number}
     */
    this.id = -1;

    /**
     * @type {boolean}
     * @private
     */
    this._dirty = true;
  }
  
  getDOMElement() {
    return this._elem;
  }
  
  _assignId(id) {
    this.id = id;
  }
  
  _initRenderBackend() {
    this._elem = zdom.createCanvas(
      this._canvas.width, this._canvas.height);
    this._ctx = this._elem.getContext('2d');
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
    this._transform = transform;
    this._markDirty();
    if(this._parent) {
      this._parent._markDirty();
    }
  }
  
  _clearCanvas() {
    this._ctx.save();
    this._ctx.setTransform(1,0,0,1,0,0); // Identity
    this._ctx.clearRect(0,0,this._width, this._height);
    this._ctx.restore();
  }

  _pushContext() {
    this._ctx.save();
  }

  _popContext() {
    this._ctx.restore();
  }
  
  _markDirty() {
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