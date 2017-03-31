
import Item from './item'

class RenderShape extends Item {

  /**
   * @memberof zcanvas.backend
   * @param {ZCanvas~PathDefinition} pathdef
   * @param {ZCanvas~Style} style
   * @param {Transform} transform
   */
  constructor(pathdef, style, transform) {
    super(transform);
    /**
     * Path definition
     * @type {ZCanvas~PathDefinition}
     */
    this.pathdef = pathdef;
    /**
     * Style
     * @type {ZCanvas~Style}
     */
    this.style = style;
    this._markDirty();
  }

  /**
   * Updates style of this RenderShape by merging input style to it
   * @param {ZCanvas~Style} style
   */
  updateStyle(style) {
    this.style = Object.assign(this.style, style);
    this._markDirty();
    if(this.parent) {
      this.parent._markDirty();
    }
  }

  /**
   * Clone this RenderShape
   * @returns {RenderShape}
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

export default RenderShape;