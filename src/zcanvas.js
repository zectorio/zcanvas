
import choice from './backend'
import constants from './constants'

/**
 * @class
 */
class ZCanvas {

  /**
   * @param {string=} backend
   * @param {number=} width
   * @param {number=} height
   */
  constructor(backend='svg', width=640, height=480) {
    let {Backend,Group,Shape} = choice(backend);
    this.backend = new Backend(width, height);
    ZCanvas.Group = Group;
    ZCanvas.Shape = Shape;
  }

  /**
   * Return DOM Element implementing this canvas
   * @returns {Element}
   */
  getDOMElement() {
    return this.backend.getDOMElement();
  }

  /**
   * Return root item
   * @returns {SVGGroup}
   */
  root() {
    return this.backend.root();
  }

  /**
   * Start render Loop
   * If ontick callback is passed, it's invoked at every tick
   * @param {ZCanvas~ontick} [ontick]
   */
  render(ontick=null) {
    this.backend.render(ontick);
  }

  /**
   * Resize canvas
   * @param {number} width
   * @param {number} height
   */
  resize(width, height) {
    this.backend.resize(width, height);
  }

  /**
   * @callback ZCanvas~ontick
   * @param {Object} Event
   * @param {number} Event.delta Time since last tick (in milliseconds)
   * @param {number} Event.total Time since render loop started (in milliseconds)
   */

  /**
   * @typedef {Object} ZCanvas~Style
   * @property {string} stroke CSS color values
   * @property {string} fill CSS color values
   * @property {number} strokeWidth
   * @property {number} strokeOpacity 0.0 to 1.0
   * @property {number} fillOpacity 0.0 to 1.0
   */

  /**
   * @typedef {Object} ZCanvas~PathDefinition
   * @property {string} type `line`,`rect`,`circle`,`ellipse`,`qbez`,`cbez`,`pathseq`
   * @property {number} cx Circle/Ellipse center
   * @property {number} cy Circle/Ellipse center
   * @property {number} rx Ellipse radius
   * @property {number} ry Ellipse radius
   * @property {number} r Circle radius
   * @property {number} w Rectangle width
   * @property {number} h Rectangle height
   * @property {number} x Rectangle left
   * @property {number} y Rectangle top
   * @property {number} x1 Line start
   * @property {number} y1 Line start
   * @property {number} x2 Line end
   * @property {number} y2 Line end
   * @property {Array.<Array.<string|number>>} commands Path data commands for `pathseq`
   */
}

ZCanvas.K = constants;

export default ZCanvas;
