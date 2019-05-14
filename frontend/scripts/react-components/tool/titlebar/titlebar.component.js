export default class {
  onCreated(props) {
    this.nodesTitles = document.querySelector('.js-nodes-titles');
    this.selectNodes(props);
    this.highlightNode(props);
  }

  onRemoved() {
    return false;
  }

  highlightNode({ showTitles }) {
    this._toggle(showTitles);
  }

  selectNodes({ selectedNodesData }) {
    this._toggle(selectedNodesData.length > 0);
  }

  _toggle(showTitles) {
    this.nodesTitles.classList.toggle('is-hidden', !showTitles);
  }
}
