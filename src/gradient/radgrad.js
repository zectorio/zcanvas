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
import {Transform} from 'zmath'

export default class RadialGradient extends Gradient {
  constructor(gradstoplist, center, radius) {
    super();
    this.stoplist = gradstoplist;
    this.center = center;
    this.radius = radius;

    this.rotation = 0;
    this.scale = [1,1];
  }

  toMemento() {
    return {
      stoplist : this.stoplist.toMemento(),
      center : this.center,
      radius : this.radius,
      rotation : this.rotation,
      scale : this.scale
    };
  }

  clone() {
    return RadialGradient.fromMemento(this.toMemento());
  }

  toString() {
    return `radgrad center:${vec2.format(this.center)}`+
      `rx:${this.rx},ry:${this.ry} stops:${this.stoplist.toString()}`;
  }
  
  toDOM(id) {
    let radgradelem = zdom.createSVGElement('radialGradient');
    zdom.id(radgradelem, id);
    for(let stop of this.stoplist.getStops()) {
      let stopelem = zdom.createSVGElement('stop');
      zdom.set(stopelem, 'offset', stop.position);
      zdom.set(stopelem, 'stop-color', stop.kolor.toCSSHex());
      zdom.set(stopelem, 'stop-opacity', stop.kolor.alpha());
      zdom.add(radgradelem, stopelem);
    }
    zdom.set(radgradelem, 'gradientUnits', 'userSpaceOnUse');
    zdom.set(radgradelem, 'cx', this.center[0]);
    zdom.set(radgradelem, 'cy', this.center[1]);
    zdom.set(radgradelem, 'r', this.radius);

    let xform = Transform.rotateAndScaleAround(
      this.rotation, this.scale, this.center);
    zdom.set(radgradelem, 'gradientTransform', xform.toAttributeString());
    return radgradelem;
  }

  /**
   * Creates Canvas Radial Gradient
   * @param {CanvasRenderingContext2D} ctx
   * @returns {CanvasGradient}
   */
  toCanvas(ctx) {
    let [cx,cy] = this.center;
    let rgrad = ctx.createRadialGradient(cx,cy,0, cx,cy, this.radius);
    this.stoplist.getStops().forEach(stop => {
      rgrad.addColorStop(stop.position, stop.kolor.toCSS());
    });
    return rgrad;
  }

  static fromMemento(m) {
    return new RadialGradient(
      GradientStopList.fromMemento(m.stoplist), m.center, m.rx, m.ry, m.rotation
    );
  }
}

