
import ZCanvas from '../src/zcanvas';
import {vec2, geom, toDeg, toRad, Transform, Rotation} from 'zmath'


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

  /*
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
   */

  /*
  zc.root().add(new ZCanvas.RenderShape({
    type : 'path',
    curveseq : [
      ['M',400,200],
      ['C',400,250,450,250,500,200]
    ]
  },{
    stroke:'#000',
    strokeWidth : 15,
    fill : '#f70'
  }));
  
  let group1 = new ZCanvas.RenderGroup();
  group1
  // zc.root()
    .add(new ZCanvas.RenderShape({
    type : 'qbez',
    cpoints : [[10,10],[15,10],[100,10]]
  },{
    stroke:'#000',
    strokeWidth : 15
  }));
  zc.root().add(group1);
  */

  let group1 = new ZCanvas.RenderGroup();
  group1.add(new ZCanvas.RenderShape({
  //zc.root().add(new ZCanvas.RenderShape({
    type : 'rect',
    x:100,y:100,
    w:200,h:200
  },{
    stroke:'#000',
    fill : '#ffef3e',
    strokeWidth : 2
  }));
  
  zc.root().add(group1);
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

function testWithNoGroups(style) {

  const WIDTH=1000;
  const HEIGHT=800;
  let zc = new ZCanvas('canvas', WIDTH, HEIGHT);
  document.body.appendChild(zc.getDOMElement());
  
  let X = 50;
  let Y = 50;

  // ---
  // Row 1
  // ---
  
  zc.root().add(new ZCanvas.RenderShape({
    type : 'line',
    x1 : X,
    y1 : Y,
    x2 : X+50,
    y2 : Y+50
  }, style));
  
  X += 100;
  
  zc.root().add(new ZCanvas.RenderShape({
    type : 'rect',
    x : X,
    y : Y,
    w : 50,
    h : 50
  }, style));

  X += 100;
  
  zc.root().add(new ZCanvas.RenderShape({
    type : 'circle',
    cx : X+25,
    cy : Y+25,
    r :25 
  }, style));

  X += 100;
  
  zc.root().add(new ZCanvas.RenderShape({
    type : 'ellipse',
    cx : X+25,
    cy : Y+25,
    rx : 25,
    ry : 20
  }, style));
  
  X += 100;
  
  zc.root().add(new ZCanvas.RenderShape({
    type : 'qbez',
    cpoints : [
      [X,Y+50], [X+25,Y], [X+50,Y+50]
    ]
  }, style));
  
  X += 100;
  
  zc.root().add(new ZCanvas.RenderShape({
    type : 'cbez',
    cpoints : [
      [X,Y+50], [X+10,Y], [X+40,Y+50], [X+50,Y]
    ]
  }, style));

  X = 50;
  Y += 100;

  // ---
  // Row 2
  // ---

  {
    let earc = geom.EllipseArc.circularArcFrom3Points(
      [X,Y],[X+50,Y+25],[X,Y+50]);
    let {center:[cx,cy],rx,ry,start,end,ccw} = earc;
    zc.root().add(new ZCanvas.RenderShape({
      type : 'path',
      curveseq : [
        ['E',cx,cy,rx,ry,start,end,ccw?1:0]
      ]
    }, style));
  }
  
  X += 100;
  
  {
    let earc = geom.EllipseArc.circularArcFrom3Points(
      [X+50,Y],[X,Y+25],[X+50,Y+50]);
    let {center:[cx,cy],rx,ry,start,end,ccw} = earc;
    zc.root().add(new ZCanvas.RenderShape({
      type : 'path',
      curveseq : [
        ['E',cx,cy,rx,ry,start,end,ccw?1:0]
      ]
    }, style));
  }
  
  X += 100;

  {
    let earc = geom.EllipseArc.circularArcFrom3Points(
      [X+50,Y],[X,Y+25],[X+50,Y+50]);
    let {center:[cx,cy],rx,ry,start,end,ccw} = earc;
    zc.root().add(new ZCanvas.RenderShape({
      type : 'path',
      curveseq : [
        ['M',X+50,Y],
        ['E',cx,cy,rx,ry,start,end,ccw?1:0],
        ['Z']
      ]
    }, style));
  }
  
  X += 100;

  {
    let earc = geom.EllipseArc.circularArcFrom3Points(
      [X+50,Y],[X,Y+25],[X+50,Y+50]);
    let {center:[cx,cy],rx,ry,start,end,ccw} = earc;
    zc.root().add(new ZCanvas.RenderShape({
      type : 'path',
      curveseq : [
        ['M',X+50,Y],
        ['E',cx,cy,rx,ry,start,end,ccw?1:0],
        ['L',X+50,Y]
      ]
    }, style));
  }

  X += 100;

  {
    let earc1 = geom.EllipseArc.circularArcFrom3Points(
      [X+50,Y],[X,Y+25],[X+50,Y+50]);
    let {center:[cx1,cy1],rx:rx1,ry:ry1,start:start1,end:end1,ccw:ccw1} = earc1;
    let earc2 = geom.EllipseArc.circularArcFrom3Points(
      [X+50,Y+50],[X+25,Y+25],[X+50,Y]);
    let {center:[cx2,cy2],rx:rx2,ry:ry2,start:start2,end:end2,ccw:ccw2} = earc2;
    zc.root().add(new ZCanvas.RenderShape({
      type : 'path',
      curveseq : [
        ['E',cx1,cy1,rx1,ry1,start1,end1,ccw1?1:0],
        ['E',cx2,cy2,rx2,ry2,start2,end2,ccw2?1:0]
      ]
    }, style));
  }
  
  X += 100;

  {
    let earc1 = geom.EllipseArc.circularArcFrom3Points(
      [X+50,Y],[X,Y+25],[X+50,Y+50]);
    let {center:[cx1,cy1],rx:rx1,ry:ry1,start:start1,end:end1,ccw:ccw1} = earc1;
    let earc2 = geom.EllipseArc.circularArcFrom3Points(
      [X+50,Y+50],[X+25,Y+25],[X+50,Y]);
    let {center:[cx2,cy2],rx:rx2,ry:ry2,start:start2,end:end2,ccw:ccw2} = earc2;
    zc.root().add(new ZCanvas.RenderShape({
      type : 'path',
      curveseq : [
        ['E',cx1,cy1,rx1,ry1,start1,end1,ccw1?1:0],
        ['E',cx2,cy2,rx2,ry2,start2,end2,ccw2?1:0],
        ['Z']
      ]
    }, style));
  }

  X += 100;

  {
    let earc1 = geom.EllipseArc.circularArcFrom3Points(
      [X,Y],[X+50,Y+25],[X,Y+50]);
    let {center:[cx1,cy1],rx:rx1,ry:ry1,start:start1,end:end1,ccw:ccw1} = earc1;
    let earc2 = geom.EllipseArc.circularArcFrom3Points(
      [X,Y+50],[X+25,Y+25],[X,Y]);
    let {center:[cx2,cy2],rx:rx2,ry:ry2,start:start2,end:end2,ccw:ccw2} = earc2;
    zc.root().add(new ZCanvas.RenderShape({
      type : 'path',
      curveseq : [
        ['E',cx1,cy1,rx1,ry1,start1,end1,ccw1?1:0],
        ['E',cx2,cy2,rx2,ry2,start2,end2,ccw2?1:0]
      ]
    }, style));
  }
  
  X += 100;

  {
    let earc1 = geom.EllipseArc.circularArcFrom3Points(
      [X,Y+50],[X+25,Y],[X+50,Y+50]);
    let {center:[cx1,cy1],rx:rx1,ry:ry1,start:start1,end:end1,ccw:ccw1} = earc1;
    let earc2 = geom.EllipseArc.circularArcFrom3Points(
      [X+50,Y+50],[X+25,Y+25],[X,Y+50]);
    let {center:[cx2,cy2],rx:rx2,ry:ry2,start:start2,end:end2,ccw:ccw2} = earc2;
    zc.root().add(new ZCanvas.RenderShape({
      type : 'path',
      curveseq : [
        ['E',cx1,cy1,rx1,ry1,start1,end1,ccw1?1:0],
        ['E',cx2,cy2,rx2,ry2,start2,end2,ccw2?1:0]
      ]
    }, style));
  }

  X += 100;

  {
    let earc1 = geom.EllipseArc.circularArcFrom3Points(
      [X,Y],[X+25,Y+50],[X+50,Y]);
    let {center:[cx1,cy1],rx:rx1,ry:ry1,start:start1,end:end1,ccw:ccw1} = earc1;
    let earc2 = geom.EllipseArc.circularArcFrom3Points(
      [X+50,Y],[X+25,Y+25],[X,Y]);
    let {center:[cx2,cy2],rx:rx2,ry:ry2,start:start2,end:end2,ccw:ccw2} = earc2;
    zc.root().add(new ZCanvas.RenderShape({
      type : 'path',
      curveseq : [
        ['E',cx1,cy1,rx1,ry1,start1,end1,ccw1?1:0],
        ['E',cx2,cy2,rx2,ry2,start2,end2,ccw2?1:0]
      ]
    }, style));
  }
  
  X = 50;
  Y += 100;

  // ---
  // Row 3
  // ---

  {
    let earc = geom.EllipseArc.circularArcFrom3Points(
      [X,Y],[X+50,Y+25],[X,Y+50]);
    let {center:[cx,cy],rx,ry,start,end,ccw} = earc;
    zc.root().add(new ZCanvas.RenderShape({
      type : 'path',
      curveseq : [
        ['M',X,Y+25],
        ['L',X,Y],
        ['E',cx,cy,rx,ry,start,end,ccw?1:0],
        ['Q',X+20,Y+37.5,X,Y+25],
        ['Z']
      ]
    }, style));
  }
  zc.render();
}


window.onload = function () {
  switch(window.location.hash) {
    case '#onlyshapes-stroke2':
      testWithNoGroups({stroke:'#000', strokeWidth:2});
      break;
    case '#onlyshapes-stroke6':
      testWithNoGroups({stroke:'#000', strokeWidth:6});
      break;
    case '#onlyshapes-fillnostroke':
      testWithNoGroups({stroke:'none', fill:'#f88'});
      break;
  }
  document.querySelector('select').value = window.location.hash.substr(1);
  
  document.querySelector('select').onchange = ev => {
    let url =
      window.location.origin+window.location.pathname+'#'+ev.target.value;
    window.location.href = url;
    window.location.reload();
  }
};