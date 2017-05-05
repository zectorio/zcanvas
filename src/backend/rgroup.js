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

class RenderGroup extends Item {

  /**
   * @param {Transform} transform
   */
  constructor(transform) {
    super(transform);
    this.children = [];
  }

  /**
   * Append child to the list of children
   * @param {Item} child - Can be RenderShape or RenderGroup
   */
  add(child) {
    this.children.push(child);
    child._setParent(this);
    if(this.backend) {
      RenderGroup.walk(child, node => {
        this.backend.register(node);
        node._setBackend(this.backend);
      });
    }
    this._markDirty();
  }

  /**
   * Prepend child to the list of children
   * @param {Item} child
   */
  prepend(child) {
    this.children.unshift(child);
    child._setParent(this);
    if(this.backend) {
      RenderGroup.walk(child, node => {
        this.backend.register(node);
        node._setBackend(this.backend);
      });
    }
    this._markDirty();
  }

  /**
   * Render
   */
  render() {
    this.children.forEach(child => {
      if(child._isDirty()) {
        child.render();
      }
    });
    this._markClean();
  }

  /**
   * Walk nodes under this group recursively
   * @param {Item} node
   * @param {function(Item)} callback
   */
  static walk(node, callback) {
    let step = n => {
      if(n instanceof RenderGroup) {
        n.children.forEach(c => step(c))
      }
      callback(n);
    };
    step(node);
  }

}

export default RenderGroup;
