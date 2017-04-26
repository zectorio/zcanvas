
export default class Gradient {
  /**
   * @abstract
   * @param {CanvasRenderingContext2D} ctx
   * @returns {CanvasGradient}
   */
  toCanvas(ctx) {
    throw new Error('Not implemented');
  }
}