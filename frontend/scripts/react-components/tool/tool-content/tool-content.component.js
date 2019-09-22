export default class {
  onCreated(props) {
    this.onSankeyReset = this._resetSankey.bind(this);

    this._setVars();
    this.toggleMapLayersVisibility(props);
    this.toggleError(props);
  }

  onRemoved() {
    this.sankeyResetButton.removeEventListener('click', this.onSankeyReset);
  }

  _setVars() {
    this.el = document.querySelector('.js-tool-content');
    this.map = this.el.querySelector('.js-map-container');
    this.sankeyError = document.querySelector('.js-sankey-error');
    this.sankeyResetButton = document.querySelector('.js-sankey-reset');

    this.sankeyResetButton.addEventListener('click', this.onSankeyReset);
  }

  _resetSankey() {
    this.callbacks.resetSankey();
  }

  toggleMapLayersVisibility({ isVisible }) {
    this.el.classList.toggle('-open', isVisible);
  }

  toggleError({ noLinksFound }) {
    this.sankeyError.classList.toggle('is-hidden', !noLinksFound);
  }
}
