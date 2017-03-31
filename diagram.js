
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
