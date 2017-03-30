
import Item from './item'

/**
 * @class
 * @memberof zcanvas.backend
 */
class Group extends Item {

  /**
   * @param {Transform} transform
   */
  constructor(transform) {
    super(transform);
    this.children = [];
  }

  /**
   * Append child to the list of children
   * @param {Item} child - Can be Shape or Group
   */
  add(child) {
    this.children.push(child);
    child._setParent(this);
    if(this.backend) {
      Group.walk(child, node => {
        this.backend.register(node);
        node._setBackend(this.backend);
      });
    }
    this._markDirty();
  }

  /**
   * Prepend child to the list of children
   * @param {Item} child
   */
  prepend(child) {
    this.children.unshift(child);
    child._setParent(this);
    if(this.backend) {
      Group.walk(child, node => {
        this.backend.register(node);
        node._setBackend(this.backend);
      });
    }
    this._markDirty();
  }

  /**
   * Render
   */
  render() {
    this.children.forEach(child => {
      if(child._isDirty()) {
        child.render();
      }
    });
    this._markClean();
  }

  /**
   * Walk nodes under this group recursively
   * @param {Item} node
   * @param {function(Item)} callback
   */
  static walk(node, callback) {
    let step = n => {
      if(n instanceof Group) {
        n.children.forEach(c => step(c))
      }
      callback(n);
    };
    step(node);
  }

}

export default Group;
