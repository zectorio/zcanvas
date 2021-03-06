/*

 Copyright (C) 2017 Jayesh Salvi, Blue Math Software Inc.

 This file is part of Zector Canvas.

 Zector Canvas is free software: you can redistribute it and/or modify
 it under the terms of the GNU Affero General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 Zector Canvas is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU Affero General Public License for more details.

 You should have received a copy of the GNU Affero General Public License
 along with Zector Canvas.  If not, see <http://www.gnu.org/licenses/>.

 */


import choice from './backend'
import constants from './constants'

class ZCanvas {

  /**
   * @param {string=} backend
   * @param {number=} width
   * @param {number=} height
   */
  constructor(backend='svg', width=640, height=480) {
    let {RenderBackend,RenderGroup,RenderShape} = choice(backend);
    this.backend = new RenderBackend(width, height);
    ZCanvas.RenderGroup = RenderGroup;
    ZCanvas.RenderShape = RenderShape;
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
   * @returns {RenderGroup}
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
   * The PathDefinition data structure is used to specify the geometry of the
   * {@link RenderShape}. It can be used to create basic shapes as well as
   * complex shapes made of multiple curve (possibly having holes).
   *
   * Type - required properties of PathDefinition
   * * `line` - `x1`,`x2`,`y1`,`y2`
   * * `circle` - `cx`,`cy`,`r`
   * * `ellipse` - `cx`,`cy`,`rx`,`ry`
   * * `rect` - `x`,`y`,`w`,`h`
   * * `qbez` - `cpoints` (Array of 3 points)
   * * `cbez` - `cpoints` (Array of 4 points)
   * * `path` - `curveseq`
   *
   * @typedef {Object} ZCanvas~PathDefinition
   * @property {string} type `line`,`rect`,`circle`,`ellipse`,`qbez`,`cbez`,`path`
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
   * @property {Array.<Point2D>} cpoints For `qbez` and `cbez`
   * @property {Array.<ZCanvas~CurveCommand>} curveseq Sequence of Curves
   *
   */

  /**
   * @typedef {Array.<string|number>} ZCanvas~CurveCommand
   * Following formats are supported
   * @example
   * ['M',x,y] // Move context to point [x,y]
   * ['L',x,y] // Straight line from current point to [x,y]
   * ['Q',x1,y1,x2,y2] // Quadratic bezier curve from current point to [x2,y2]
   *           // with control point at [x1,y1]
   * ['C',x1,y1,x2,y2,x3,y3] // Cubic bezier curve from current point to [x3,y3]
   *           // with control points at [x1,y1] and [x2,y2]
   * ['E',cx,cy,rx,ry, start,end,ccw] // Elliptical arc with center at [cx,cy],
   *           // of radius rx,ry, from angle start to end (in radians) in
   *           // counter-clockwise or clockwise sense (boolean).It's the caller's
   *           // responsibility to make sure that `start` evaluates to current
   *           // point of the context and `end` corresponds to the point at
   *           // which context will move to before processing next curve command.
   *           // If that's not the case, there won't be any error, but the
   *           // rendered output won't be desirable. 
   * ['Z']     // End Curve Sequence
   */
}

export default ZCanvas;
