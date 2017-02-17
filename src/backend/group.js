
import Item from './item'

class Group extends Item {

  constructor() {
    super();
    this.children = [];
  }

  /**
   * Add child item to the group
   * @param child - Can be Shape or Group
   */
  add(child) {
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
