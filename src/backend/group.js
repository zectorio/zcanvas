
import Item from './item'
import Shape from './shape'

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
    this.backend.register(child);
    this.children.push(child);
    child._setBackend(this.backend);
    child._setParent(this);
  }

  render() {
    this.children.forEach(child => {
      if(child instanceof Group || (child instanceof Shape && child._isDirty())) {
        child.render();
      }
    })
  }

}

export default Group;
