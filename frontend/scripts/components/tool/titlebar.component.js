export default class {
  onCreated() {
    this.nodesTitles = document.querySelector('.js-nodes-titles');
  }

  highlightNode(showTitles) {
    this._toggle(showTitles);
  }

  selectNodes(selectedNodesData) {
    this._toggle(selectedNodesData.length > 0);
  }

  _toggle(showTitles) {
    this.nodesTitles.classList.toggle('is-hidden', !showTitles);
  }
}
