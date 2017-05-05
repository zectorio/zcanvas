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


import {Kolor} from 'zbits'

export default class GradientStopList {
  constructor(kolor0, kolor1) {
    console.assert(kolor0 && kolor1);
    console.assert(kolor0 instanceof Kolor && kolor1 instanceof Kolor);
    this.stop0 = {
      position : 0.0,
      kolor : kolor0
    };
    this.stop1 = {
      position : 1.0,
      kolor : kolor1
    };
    this.istops = [];
  }

  addStop(position, kolor, offset) {
    console.assert(position >= 0.0 && position <= 1.0);
    console.assert(kolor instanceof Kolor);
    this.istops.push({position,kolor,offset});
    this.istops.sort((a, b) => a.position-b.position);
  }

  getStops() {
    return [this.stop0, ...this.istops, this.stop1];
  }

  getStopLimits(stop) {
    let index = this.istops.indexOf(stop);
    if(index >= 0) {
      let lower, upper;
      if(index === 0) {
        lower = 0.0;
      } else {
        lower = this.istops[index-1].position;
      }
      if(index === this.istops.length-1) {
        upper = 1.0;
      } else {
        upper = this.istops[index+1].position;
      }
      return [lower,upper];
    } else if(stop === this.stop0) {
      return [0.0, this.istops[0].position];
    } else if(stop === this.stop1) {
      return [this.istops[this.istops.length-1].position, 1.0];
    } else {
      console.assert(false);
    }
  }

  clone() {
    return GradientStopList.fromMemento(this.toMemento());
  }

  toMemento() {
    return {
      stop0kolor : this.stop0.kolor.toMemento(),
      stop1kolor  : this.stop1.kolor.toMemento(),
      stop0offset : this.stop0.offset,
      stop1offset : this.stop1.offset,
      istops : this.istops.map(stop => {
        return {
          position : stop.position,
          kolor : stop.kolor.toMemento(),
          offset : stop.offset
        };
      })
    };
  }
  
  static fromMemento(m) {
    let gradstoplist = new GradientStopList(
      Kolor.fromMemento(m.stop0kolor), Kolor.fromMemento(m.stop1kolor));
    gradstoplist.stop0.offset = m.stop0offset;
    gradstoplist.stop1.offset = m.stop1offset;
    m.istops.forEach(stop => {
      gradstoplist.addStop(stop.position, Kolor.fromMemento(stop.kolor), stop.offset);
    });
    return gradstoplist;
  };


  toString() {
    throw new Error('Not implemented');
  }
}

