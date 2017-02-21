
import Item from './item'

class Group extends Item {

  constructor(transform) {
    super(transform);
    this.children = [];
    this._markDirty();
  }

  /**
   * Append child to the list of children
   * @param child - Can be Shape or Group
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
  }

  /**
   * Prepend child to the list of children
   * @param child
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
  }

  render() {
    this.children.forEach(child => {
      if(child._isDirty() || child instanceof Group) {
        child.render();
      }
    });
    this._markClean();
  }

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
