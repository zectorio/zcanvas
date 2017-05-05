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


import Gradient from './gradbase'
import GradientStopList from './gradstoplist'
import zdom from 'zdom'

export default class LinearGradient extends Gradient {
  constructor(gradstoplist, start, end) {
    super();
    this.stoplist = gradstoplist;
    this.start = start;
    this.end = end;
  }

  toString() {
    let [x1,y1] = this.start;
    let [x2,y2] = this.end;
    return `lingrad [${x1},${y1}] -> [${x2},${y2}]`+
      ` ${this.stoplist.toString()}`;
  }

  /**
   * Creates Canvas Linear Gradient
   * @param {CanvasRenderingContext2D} ctx
   * @returns {CanvasGradient}
   */
  toCanvas(ctx) {
    let lgrad = ctx.createLinearGradient(...this.start,...this.end);
    this.stoplist.getStops().forEach(stop => {
      lgrad.addColorStop(stop.position, stop.kolor.toCSS());
    });
    return lgrad;
  }
  
  toDOM(id) {
    let lingradelem = zdom.createSVGElement('linearGradient');
    zdom.id(lingradelem, id);
    for(let stop of this.stoplist.getStops()) {
      let stopelem = zdom.createSVGElement('stop');
      zdom.set(stopelem, 'offset', stop.position);
      zdom.set(stopelem, 'stop-color', stop.kolor.toCSSHex());
      zdom.set(stopelem, 'stop-opacity', stop.kolor.alpha());
      zdom.add(lingradelem, stopelem);
    }
    let [x1,y1] = this.start;
    let [x2,y2] = this.end;
    zdom.set(lingradelem, 'gradientUnits', 'userSpaceOnUse');
    zdom.set(lingradelem, 'x1', x1);
    zdom.set(lingradelem, 'y1', y1);
    zdom.set(lingradelem, 'x2', x2);
    zdom.set(lingradelem, 'y2', y2);
    return lingradelem;
  }
  
  clone() {
    return LinearGradient.fromMemento(this.toMemento());
  }

  toMemento() {
    return {
      stoplist : this.stoplist.toMemento(),
      start : this.start.slice(),
      end : this.end.slice()
    };
  }

  static fromMemento(m) {
    return new LinearGradient(
      GradientStopList.fromMemento(m.stoplist), m.start, m.end);
  }
}


