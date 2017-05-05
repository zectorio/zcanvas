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


class RenderBackend {

  /**
   * @param {number} width
   * @param {number} height
   */
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this._items = [];
    this._idCounter = 0;
    this._needsRedraw = true;
  }

  /**
   * Register item to this canvas backend, by assigning a new id to it
   * and tracking it
   * @param item
   */
  register(item) {
    let id = this._generateId();
    this._items[id] = item;
    item._assignId(id);
  }

  _generateId() {
    return this._idCounter++;
  }

  /**
   * @abstract
   */
  getDOMElement() {
    throw new Error('Not implemented');
  }

  /**
   * @abstract
   */
  root() {
    throw new Error('Not implemented');
  }

  _markDirty() {
    this._needsRedraw = true;
  }

  /**
   * Render
   */
  render() {
    this._root.render();
  }

  /**
   * Resize canvas
   * @param {number} width
   * @param {number} height
   */
  resize(width, height) {
    this.width = width;
    this.height = height;
  }

}

export default RenderBackend;
