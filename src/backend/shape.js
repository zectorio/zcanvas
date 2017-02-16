
class Shape {
  constructor(geometry, style, callbacks) {

  }

  setGeometry(geometry) {
    throw new Error('Not implemented');
  }

  updateStyle(key, value) {
    throw new Error('Not implemented');
  }

  updateCallbacks(newCallbacks) {
    throw new Error('Not implemented');
  }

}

export default Shape;