
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
      createLayer : {}
    }
  },
  Layer : {
    members : [
      'Shape'
    ],
    methods : {
      addShape : {
        calls : []
      },
      removeShape : {}
    }
  },
  Shape : {},
  Film : {},
  PickCanvas : {}
});

console.log(dot);
