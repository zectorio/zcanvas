
import ZCanvas from '../src/zcanvas';
import {vec2, geom, Transform, Rotation} from 'zmath'

import Stats from 'stats.js'

function setupFPSStats() {
  window.fpsStats = new Stats();
  window.fpsStats.setMode(0); // 0: fps, 1: ms, 2: mb

  window.fpsStats.domElement.style.position = 'absolute';
  window.fpsStats.domElement.style.left = '0px';
  window.fpsStats.domElement.style.top = (window.innerHeight-50)+'px';

  document.body.appendChild( window.fpsStats.domElement );
}

function testBlinking() {

  const WIDTH=640;
  const HEIGHT=480;

  let zc = new ZCanvas('svg', WIDTH, HEIGHT);

  document.body.appendChild(zc.getDOMElement());

  let velocity1 = [100,160];
  let position1 = [100,100];

  let shape1 = new ZCanvas.RenderShape(
    {type:'circle', cx:0,cy:0,r:50},
    {stroke:'#000',fill:'#f00', strokeWidth:4},
    new Transform().translate(...position1)
  );
  let shape2 = new ZCanvas.RenderShape(
    {type:'circle', cx:250, cy:200, r:50},
    {stroke:'#000',fill:'#00f', strokeWidth:4});
  let shape3 = new ZCanvas.RenderShape(
    {type:'line',x1:300,y1:300,x2:350,y2:350},
    {stroke:'#000',fill:'#00f', strokeWidth:4});
  zc.root().add(shape1);
  zc.root().add(shape2);
  zc.root().add(shape3);

  let g1 = new ZCanvas.RenderGroup(new Rotation(-Math.PI/6));
  let rect1 = new ZCanvas.RenderShape(
    {type:'rect', x:100, y:300, w:30, h:60},
    {stroke:'#000',fill:'#ff0', strokeWidth:4});
  let rect2 = new ZCanvas.RenderShape(
    {type:'rect', x:300, y:300, w:30, h:60},
    {stroke:'#000',fill:'#f0f', strokeWidth:4});

  let pathshape = new ZCanvas.RenderShape(
    {type:'pathseq', commands : [
      ['M',20,20],
      ['L',100,130],
      ['L',230,20],
      ['L',20,20],
      ['Z']
    ]},
    {stroke:'#000',fill:'#f0f', strokeWidth:4}
  );

  g1.add(rect1);
  g1.add(rect2);

  zc.root().add(g1);
  zc.root().add(pathshape);

  zc.render((ev) => {

    window.fpsStats.begin();

    let dpos = vec2.mul(velocity1, ev.delta*0.001);
    position1 = vec2.add(position1, dpos);

    if(position1[0] > WIDTH || position1[0] < 0) {
      velocity1[0] *= -1;
    }
    if(position1[1] > HEIGHT || position1[1] < 0) {
      velocity1[1] *= -1;
    }

    if(Math.round(ev.total*0.001) % 2) {
      rect1.hide();
    } else {
      rect1.show();
    }
    if(Math.round(ev.total*0.001) % 4) {
      g1.show();
    } else {
      g1.hide();
    }

    shape1.setTransform(new Transform().translate(...position1));

    window.fpsStats.end();

  });
}

function testBasicShapes() {
  const WIDTH=640;
  const HEIGHT=480;
  let zc = new ZCanvas('canvas', WIDTH, HEIGHT);
  document.body.appendChild(zc.getDOMElement());

  zc.root().add(new ZCanvas.RenderShape({
    type : 'rect',
    x:100,y:100,
    w:200,h:200
  },{
    stroke:'none',
    fill : '#ffef3e'
  }));
  zc.root().add(new ZCanvas.RenderShape({
    type : 'line',
    x1:100,y1:100,
    x2:200,y2:200
  },{
    stroke:'#000'
  }));
  zc.root().add(new ZCanvas.RenderShape({
    type : 'circle',
    cx:200,cy:200,r:50
  },{
    stroke:'#000'
  }));
  zc.root().add(new ZCanvas.RenderShape({
    type : 'ellipse',
    cx:200,cy:200,rx:75,ry:25
  },{
    stroke:'#000'
  }));
  zc.root().add(new ZCanvas.RenderShape({
    type : 'qbez',
    cpoints : [[100,100],[150,200],[300,100]]
  },{
    stroke:'#000'
  }));
  zc.root().add(new ZCanvas.RenderShape({
    type : 'cbez',
    cpoints : [[100,100],[150,100],[200,150],[250,300]]
  },{
    stroke:'#000'
  }));


  zc.root().add(new ZCanvas.RenderShape({
    type : 'path',
    curveseq : [
      ['M',400,100],
      ['L',450,100],
      ['L',450,150],
      ['Q',430,200,400,100]
    ]
  },{
    stroke:'none',
    fill : '#f00'
  }));

  zc.root().add(new ZCanvas.RenderShape({
    type : 'path',
    curveseq : [
      ['M',400,200],
      ['C',400,250,450,250,500,200],
    ]
  },{
    stroke:'#000',
    strokeWidth : 3,
    fill : '#f70'
  }));

  zc.render();
}

function testComplexShapes() {
  const WIDTH=640;
  const HEIGHT=480;
  let zc = new ZCanvas('canvas', WIDTH, HEIGHT);
  document.body.appendChild(zc.getDOMElement());

  let earc = geom.EllipseArc.circularArcFrom3Points([220,220],[270,250],[220,320]);

  zc.root().add(new ZCanvas.RenderShape({
    type : 'path',
    curveseq : [
      // Outer boundary
      ['M',100,100],
      ['L',400,100],
      ['L',400,400],
      ['L',100,400],
      ['L',100,100],
      ['Z'],

      // Square hole
      ['M',110,110],
      ['L',110,210],
      ['L',210,210],
      ['L',210,110],
      ['L',110,110],
      ['Z'],

      // Semicircular hole
      ['M',220,220],
      ['E',earc.center[0],earc.center[1],earc.rx,earc.ry,
            earc.start, earc.end, earc.ccw?1:0],
      ['Z']
    ]
  },{
    stroke:'#000',
    strokeWidth : 3,
    fill : '#f70'
  }));

  zc.render();
}


window.onload = function () {
  setupFPSStats();
  testComplexShapes();
};