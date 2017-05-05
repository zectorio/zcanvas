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


import RenderGroup from '../rgroup'
import zdom from 'zdom'

class SVGGroup extends RenderGroup {

  /**
   * Extends {@link RenderGroup}
   * @param {Transform} transform
   */
  constructor(transform) {
    super(transform);
    this._transformstr = this.transform.toAttributeString();
  }

  /**
   * Set Transform
   * @param {Transform} transform
   */
  setTransform(transform) {
    super.setTransform(transform);
    this._transformstr = this.transform.toAttributeString();
  }

  _makeVisible() {
    if(this._elem) {
      zdom.show(this._elem);
    }
  }

  _makeInvisible() {
    if(this._elem) {
      zdom.hide(this._elem);
    }
  }

  /**
   * Render
   */
  render() {
    if(!this._elem) {
      this._elem = zdom.createG();
      zdom.id(this._elem, `zci${this.id}`);
      zdom.add(this.parent._elem, this._elem);
    }
    zdom.set(this._elem, 'transform', this._transformstr);
    this.children.forEach(child => {
      if(child.isVisible()) {
        child._makeVisible();
      } else {
        child._makeInvisible();
      }
    });
    super.render();
  }
}

export default SVGGroup;