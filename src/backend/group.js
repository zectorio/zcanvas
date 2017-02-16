
class Group {
  constructor() {
    this.children = [];
  }

  /**
   * Add child item to the group
   * @param child Can be Shape or Group
   */
  add(child) {
    this.children.push(child);
  }

}

export default Group;
