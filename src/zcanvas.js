
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
}

ZCanvas.K = constants;

export default ZCanvas;
