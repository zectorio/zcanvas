
import Item from './item'

class Group extends Item {

  constructor(transform) {
    super(transform);
    this.children = [];
    this._markDirty();
  }

  /**
   * Add child item to the group
   * @param child - Can be Shape or Group
   */
  add(child) {
    this.backend.register(child);
    this.children.push(child);
    child._setBackend(this.backend);
    child._setParent(this);
  }

  render() {
    this.children.forEach(child => {
      if(child._isDirty()) {
        child.render();
      }
    })
  }

}

export default Group;
