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