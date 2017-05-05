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

const {generateDot} = require('broadcode');

let dot = generateDot({
  title : 'ZCanvas',
  ZCanvas : {
    members : [
      'Layer',
      'Film',
      'PickCanvas'
    ],
    methods : {
      getLayer : {},
      moveLayerUp : {},
      moveLayerDown : {},
      moveLayerTop : {},
      moveLayerBottom : {},
      createLayer : {}
    }
  },
  Layer : {
    members : [
      'RenderShape'
    ],
    methods : {
      addShape : {
        calls : []
      },
      removeShape : {}
    }
  },
  Shape : {},
  Film : {
    comment : `
      Contains a canvas size of bbox of Shape`
  },
  PickCanvas : {}
});

console.log(dot);
