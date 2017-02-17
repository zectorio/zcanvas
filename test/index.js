
import ZCanvas from '../src/zcanvas';
import {vec2, Transform} from 'zmath'

import Stats from 'stats.js'

function setupFPSStats() {
  window.fpsStats = new Stats();
  window.fpsStats.setMode(0); // 0: fps, 1: ms, 2: mb

  window.fpsStats.domElement.style.position = 'absolute';
  window.fpsStats.domElement.style.left = '0px';
  window.fpsStats.domElement.style.top = (window.innerHeight-50)+'px';

  document.body.appendChild( window.fpsStats.domElement );
}

window.onload = function () {

  setupFPSStats();

  const WIDTH=640;
  const HEIGHT=480;

  let zc = new ZCanvas('svg', WIDTH, HEIGHT);

  document.body.appendChild(zc.getDOMElement());

  let tstart = new Date();
  let velocity1 = [100,160];
  let position1 = [100,100];

  let shape1 = new ZCanvas.Shape('CIRCLE 0,0 50',
    {stroke:'#000',fill:'#f00', strokeWidth:4},
    new Transform().translate(...position1)
  );
  let shape2 = new ZCanvas.Shape('CIRCLE 250,200 50',
    {stroke:'#000',fill:'#00f', strokeWidth:4});
  zc.getRoot().add(shape1);
  zc.getRoot().add(shape2);


  let g1 = new ZCanvas.Group();
  let rect1 = new ZCanvas.Shape('RECT 100,300 30,60',
    {stroke:'#000',fill:'#ff0', strokeWidth:4});
  let rect2 = new ZCanvas.Shape('RECT 300,300 30,60',
    {stroke:'#000',fill:'#f0f', strokeWidth:4});

  zc.getRoot().add(g1);

  g1.add(rect1);
  g1.add(rect2);

  let tlast = tstart;

  zc.render(() => {

    window.fpsStats.begin();

    let tcur = new Date();
    let dt = tcur-tlast;
    let dpos = vec2.mul(velocity1, dt*0.001);
    position1 = vec2.add(position1, dpos);

    if(position1[0] > WIDTH || position1[0] < 0) {
      velocity1[0] *= -1;
    }
    if(position1[1] > HEIGHT || position1[1] < 0) {
      velocity1[1] *= -1;
    }

    shape1.setTransform(new Transform().translate(...position1));

    tlast = tcur;
    window.fpsStats.end();

  });

};