
class Transform {
  /**
   * @param {number[]} [array]
   */
  constructor(array) {
    if(array) {
      this.fromArray(array);
    } else {
      // Identity transform
      this.a = 1;
      this.b = 0;
      this.c = 0;
      this.d = 1;
      this.e = 0;
      this.f = 0;
    }
    this._cachedInverse = null;
  }

  /**
   * Is this transform Identity
   * @returns {boolean}
   */
  isIdentity() {
    return this.a === 1 && this.b === 0 && this.c === 0 &&
      this.d === 1 && this.e === 1 && this.f === 0;
  }

  /**
   * Adds to the translation of this transform
   * @param {...Object}
   * @returns {Transform}
   * @example
   * // Possible usages
   * transform.translate(10,10);
   * transform.translate([10,10]);
   */
  translate() {
    if(Array.isArray(arguments[0])) {
      this.e += arguments[0][0];
      this.f += arguments[0][1];
    } else {
      this.e += arguments[0];
      this.f += arguments[1];
    }
    this._cachedInverse = null;
    return this;
  }

  /**
   * Replaces translation of this transform to input value
   * @param {...Object}
   * @returns {Transform}
   * @example
   * // Possible usages
   * transform.setTranslation(10,10);
   * transform.setTranslation([10,10]);
   */
  setTranslation() {
    if(Array.isArray(arguments[0])) {
      this.e = arguments[0][0];
      this.f = arguments[0][1];
    } else {
      this.e = arguments[0];
      this.f = arguments[1];
    }
    this._cachedInverse = null;
    return this;
  }

  /**
   * Replaces rotation values of this transform with those generated for new
   * angular rotation
   * @param {number} angle
   * @returns {Transform}
   */
  setRotation(angle) {
    let c = Math.cos(angle);
    let s = Math.sin(angle);
    this.a = c;
    this.b = s;
    this.c = -s;
    this.d = c;
    this._cachedInverse = null;
    return this;
  }

  /**
   * Creates transform that will rotate a point through an angle around a given
   * point
   * @param {number} angle
   * @param {number[]} point
   * @returns {Transform}
   */
  static rotateAround(angle, point) {
    // Ref: http://www.euclideanspace.com/maths/geometry/affine/aroundPoint/matrix2d/
    let pre = new Transform().translate(...point);
    let rotation = new Transform().setRotation(angle);
    let post = new Transform().translate(-point[0], -point[1]);
    return pre.mul(rotation).mul(post);
  }

  /**
   * Creates transform that will scale a point by given scale around a given
   * point
   * @param {number} sx
   * @param {number} sy
   * @param {number[]} point
   * @returns {Transform}
   */
  static scaleAround([sx,sy], point) {
    let pre = new Transform().translate(...point);
    let scale = new Transform().setScale(sx,sy);
    let post = new Transform().translate(-point[0], -point[1]);
    return pre.mul(scale).mul(post);
  }

  /**
   * Multiples current scale of this transform by input scale values
   * @param {number} sx
   * @param {number} sy
   * @returns {Transform}
   */
  scale(sx, sy) {
    this.a *= sx;
    this.d *= sy;
    this._cachedInverse = null;
    return this;
  }

  /**
   * Replaces current scale values of this transform by input scale values
   * @param {number} sx
   * @param {number} sy
   * @returns {Transform}
   */
  setScale(sx, sy) {
    this.a = sx;
    this.d = sy;
    this._cachedInverse = null;
    return this;
  }

  /**
   * Return scale of this transform
   * @returns {number[]}
   */
  getScale() {
    return [this.a, this.d];
  }

  /**
   * Return translation of this transform
   * @returns {number[]}
   */
  getTranslation() {
    return [this.e, this.f];
  }

  /**
   * Return array representation of this transform as described in
   * {@link https://www.w3.org/TR/SVG/coords.html#TransformMatrixDefined SVG Spec}
   * @returns {number[]}
   */
  toArray() {
    return [this.a, this.b, this.c, this.d, this.e, this.f];
  }

  /**
   * Return transform attribute string as described in
   * {@link https://www.w3.org/TR/SVG/coords.html#TransformAttribute SVG Spec}
   * @param precision
   * @returns {string}
   */
  toAttributeString(precision=2) {
    return `matrix(${this.toArray().map(x=>x.toFixed(precision)).join(',')})`;
  }

  /**
   * Replace values of this transform with the ones in input array.
   * Array format is as described in
   * {@link https://www.w3.org/TR/SVG/coords.html#TransformMatrixDefined SVG Spec}
   * @param a
   * @param b
   * @param c
   * @param d
   * @param e
   * @param f
   */
  fromArray([a,b,c,d,e,f]) {
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
    this.e = e;
    this.f = f;
    this._cachedInverse = null;
  }

  /*
   * The transformation matrix is
   *     -           -
   *     |  a  c  e  |
   * M = |  b  d  f  |
   *     |  0  0  1  |
   *     -           -
   * Det(M) = ad - bc
   *              -           - T
   *              |  A  C  E  |
   * Inverse(M) = |  B  D  F  |   * (1/Det(M))
   *              |  G  H  I  |
   *              -           -
   * A = d
   * B = -c
   * G = cf-de
   * C = -b
   * D = a
   * H = be-af
   * E = 0
   * F = 0
   * I = ad-bc
   * =>
   *              -                 -
   *              |   d  -c  cf-de  |
   * Inverse(M) = |  -b   a  be-af  |  * (1/Det(M))
   *              |   0   0  ad-bc  |
   *              -                 -
   * =>
   *              -              -
   *              |  ai  ci  ei  |
   * Inverse(M) = |  bi  di  fi  |
   *              |  0   0   1   |
   *              -              -
   */
  /**
   * Inverse of this transform
   * @returns {Transform}
   */
  inverse() {
    if(!this._cachedInverse) {
      let {a,b,c,d,e,f} = this;
      let det = a*d-b*c;
      let ai = d/det;
      let bi = -b/det;
      let ci = -c/det;
      let di = a/det;
      let ei = (c*f-d*e)/det;
      let fi = (b*e-a*f)/det;
      this._cachedInverse = new Transform([ai,bi,ci,di,ei,fi]);
    }
    return this._cachedInverse;
  }

  /*
   *      -              -
   *      |  a1  c1  e1  |
   * m1 = |  b1  d1  f1  |
   *      |  0   0   1   |
   *      -              -
   *      -              -
   *      |  a2  c2  e2  |
   * m2 = |  b2  d2  f2  |
   *      |  0   0   1   |
   *      -              -
   *
   *         -                                          -
   *         | a1*a2+c1*b2  a1*c2+c1*d2  a1*e2+c1*f2+e1 |
   * m1*m2 = | b1*a2+d1*b2  b1*c2+d1*d2  b1*e2+d1*f2+f1 |
   *         | 0            0            1              |
   *         -                                          -
   *
   */
  /**
   * Multiply this transform with other transform. Return a new Transform
   * object. Doesn't affect contents of this Transform
   * @param {!Transform} other
   * @returns {Transform}
   */
  mul(other) {
    let {a:a1,b:b1,c:c1,d:d1,e:e1,f:f1} = this;
    let {a:a2,b:b2,c:c2,d:d2,e:e2,f:f2} = other;

    return new Transform([
      a1*a2+c1*b2,
      b1*a2+d1*b2,
      a1*c2+c1*d2,
      b1*c2+d1*d2,
      a1*e2+c1*f2+e1,
      b1*e2+d1*f2+f1
    ]);
  }

  /**
   * Transform input point
   * @param {number} x
   * @param {number} y
   * @returns {number[]}
   */
  transformPoint([x,y]) {
    let {a,b,c,d,e,f} = this;
    return [
      a*x + c*y + e,
      b*x + d*y + f
    ];
  }

  /**
   * Clone this transform
   * @returns {Transform}
   */
  clone() {
    return new Transform(this.toArray());
  }

  /**
   * Generate memento
   * @returns {Object} memento
   */
  generateMemento() {
    return this.toArray();
  }

  /**
   * Revive from memento
   * @param {Object} memento
   * @returns {Transform}
   */
  static revive(memento) {
    return new Transform(memento);
  }

  toString() {
    return `a:${this.a},b:${this.b},c:${this.c},`+
      `d:${this.d},e:${this.e},f:${this.f}`;
  }

  /**
   * Identity transform object
   * @returns {Transform}
   */
  static identity() {
    return new Transform();
  }
}

function drawGrid(targetCtx) {
  
  let gridCanvas = document.createElement('canvas');
  gridCanvas.width = 100;
  gridCanvas.height = 100;
  let gridCtx = gridCanvas.getContext('2d');
  
  gridCtx.strokeStyle = '#22a';
  gridCtx.lineWidth = 1;
  gridCtx.strokeRect(0,0,100,100);

  targetCtx.save();
  
  let gridPattern = targetCtx.createPattern(gridCanvas, 'repeat');
  targetCtx.fillStyle = gridPattern;
  targetCtx.fillRect(0,0,targetCtx.canvas.width, targetCtx.canvas.height);
  
  targetCtx.restore();
}

function drawShape(targetCtx, xform) {
  let shapeCanvas = document.createElement('canvas');
  shapeCanvas.width = 100;
  shapeCanvas.height = 100;
  let shapeCtx = shapeCanvas.getContext('2d');
  
  shapeCtx.fillStyle = '#f00';
  shapeCtx.fillRect(10,10,80,80);
  
  targetCtx.save();
  targetCtx.setTransform(...xform.toArray());
  targetCtx.drawImage(shapeCanvas,100,100);
  targetCtx.restore();
}

const root2 = Math.sqrt(2);
const PI = Math.PI;

let rotationAngle = 0;
let pivot = [150,150];
let movement = [0,0];

function redraw(ctx) {
  ctx.clearRect(0,0,ctx.canvas.width, ctx.canvas.height);

  drawGrid(ctx);

  ctx.save();
  ctx.fillStyle = '#22a';
  ctx.beginPath();
  ctx.arc(300,300,5,0,2*Math.PI,true);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.fillStyle = 'rgba(100,100,100,0.3)';
  let w = root2*110*Math.cos((45+rotationAngle)*PI/180);
  let h = root2*110*Math.sin((45+rotationAngle)*PI/180);
  ctx.fillRect(0,0,w,h);
  ctx.restore();

  let translation = new Transform().translate(...movement);
  let rotation = Transform.rotateAround(Math.PI*rotationAngle/180, pivot);
  
  let xform = translation.mul(rotation);
  
  drawShape(ctx, xform);
}

window.onload = () => {

  let canvas = document.querySelector('canvas');
  let ctx = canvas.getContext('2d');
  
  redraw(ctx);
  
  document.querySelector('input[name=angle]').onmousemove = ev => {
    rotationAngle = parseFloat(ev.target.value);
    redraw(ctx);
  };
  document.querySelector('input[name=movex]').onmousemove = ev => {
    movement[0] = parseFloat(ev.target.value);
    redraw(ctx);
  };
  document.querySelector('input[name=movey]').onmousemove = ev => {
    movement[1] = parseFloat(ev.target.value);
    redraw(ctx);
  };
  for(let radioElem of document.querySelectorAll('input[name=pivot]')) {
    radioElem.onclick = ev => {
      switch(ev.target.value) {
        case 'origin':
          pivot = [0,0];
          break;
        case 'self':
          pivot = [150,150];
          break;
        case 'center':
          pivot = [300,300];
          break;
      }
    };
  }
  
  
};


