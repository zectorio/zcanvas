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


import {Transform} from 'zmath'

class Item {

  /**
   * @param {Transform} [transform]
   */
  constructor(transform) {
    /**
     * Transform
     * @type {Transform}
     */
    this.transform = transform || new Transform();

    /**
     * @type {boolean}
     * @private
     */
    this._isVisible = true;

    /**
     * @member {RenderGroup} 
     */
    this.parent = null;

    /**
     * @type {number}
     */
    this.id = -1;

    /**
     * @type {RenderBackend}
     */
    this.backend = null;
  }

  /**
   * @param {number} id
   * @private
   */
  _assignId(id) {
    this.id = id;
  }

  /**
   * @param {RenderBackend} backend
   * @private
   */
  _setBackend(backend) {
    this.backend = backend;
  }

  /**
   * @param {RenderGroup} parent
   * @private
   */
  _setParent(parent) {
    this.parent = parent;
  }

  _markDirty() {
    this._dirty = true;
    if(this.backend) {
      this.backend._markDirty();
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
    if(this.parent) {
      this.parent._markDirty();
    }
  }

  /**
   * Make the item visible
   */
  show() {
    this._isVisible = true;
    this.parent._markDirty();
  }

  /**
   * Make the item invisible
   */
  hide() {
    this._isVisible = false;
    this.parent._markDirty();
  }

  /**
   * Is this item visible?
   * @returns {boolean}
   */
  isVisible() {
    return this._isVisible;
  }

}

export default Item;