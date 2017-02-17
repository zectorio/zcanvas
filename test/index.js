
import ZCanvas from '../src/zcanvas';

window.onload = function () {

  let zc = new ZCanvas('svg', 640, 480);

  document.body.appendChild(zc.getDOMElement());

  let shape1 = new ZCanvas.Shape('CIRCLE 100,100 50',
    {stroke:'#000',fill:'#f00', strokeWidth:4});
  let shape2 = new ZCanvas.Shape('CIRCLE 250,200 50',
    {stroke:'#000',fill:'#00f', strokeWidth:4});
  zc.getRoot().add(shape1);
  zc.getRoot().add(shape2);



  zc.render();

};