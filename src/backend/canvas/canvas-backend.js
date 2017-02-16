
import Backend from '../backend'
import CanvasGroup from './canvas-group'

class CanvasBackend extends Backend {

  constructor() {
    super();
    this.root = new CanvasGroup();
  }

  getRoot() {
    return this.root;
  }

}

export default CanvasBackend;
