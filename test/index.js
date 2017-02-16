
import ZCanvas from '../src/zcanvas';
// import Shape from '../src/shape';
// import {geom} from 'zmath'

window.onload = function () {

  let zc = new ZCanvas('svg', 640, 480);

  document.body.appendChild(zc.getDOMElement());

  console.log(zc.getRoot());

  /*
  let shape = new Shape({curves:[new geom.Line([10,10],[100,200])]})
  zc.getLayer(0).addShape(shape);
  */

  zc.render();

};