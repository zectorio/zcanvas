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


import zdom from 'zdom'
import RenderBackend from '../rbackend'
import CanvasGroup from './canvas-group'

class CanvasBackend extends RenderBackend {

  constructor(width, height) {
    super(width, height);

    this._elem = zdom.createCanvas(width, height);
    this._root = new CanvasGroup();
    this._root._setBackend(this);
    this._root._setParent(this);

    this._root._initCanvas([width, height]);
    
    this._debugLocalCanvas = false;

    this.register(this._root);
  }

  getDOMElement() {
    return this._root._canvas;
  }

  root() {
    return this._root;
  }

  resize(width, height) {
    super.resize(width, height);
    zdom.set(this._elem, 'width', width);
    zdom.set(this._elem, 'height', height);
  }
}

export default CanvasBackend;
