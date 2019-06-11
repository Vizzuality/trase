export default class {
  onCreated() {
    this.onSankeyReset = this._resetSankey.bind(this);

    this._setVars();
  }

  onRemoved() {
    this.sankeyResetButton.removeEventListener('click', this.onSankeyReset);
  }

  _setVars() {
    this.sankeyResetButton = document.querySelector('.js-sankey-reset');

    this.sankeyResetButton.addEventListener('click', this.onSankeyReset);
  }

  _resetSankey() {
    this.callbacks.resetSankey();
  }
}
