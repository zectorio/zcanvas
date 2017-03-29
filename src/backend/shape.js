
import Item from './item'

class Shape extends Item {

  /**
   * @param {Object} pathdef
   * @param {Object} style
   * @param {Transform} transform
   */
  constructor(pathdef, style, transform) {
    super(transform);
    /**
     * Path definition
     * @type {Object}
     */
    this.pathdef = pathdef;
    /**
     * Style
     * @type {Object}
     */
    this.style = style;
    this._markDirty();
  }

  /**
   * Updates style of this Shape by merging input style to it
   * @param {Object} style
   */
  updateStyle(style) {
    this.style = Object.assign(this.style, style);
    this._markDirty();
    if(this.parent) {
      this.parent._markDirty();
    }
  }

  /**
   * Clone this Shape
   * @returns {Shape}
   */
  clone() {
    return new this.constructor(
      JSON.parse(JSON.stringify(this.pathdef)),
      JSON.parse(JSON.stringify(this.style)),
      this.transform.clone()
    );
  }

  /**
   * Render
   */
  render() {
    this._markClean();
  }
}

export default Shape;