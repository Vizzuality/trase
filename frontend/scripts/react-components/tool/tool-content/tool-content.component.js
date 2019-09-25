export default class {
  onCreated(props) {
    this.onSankeyReset = this._resetSankey.bind(this);

    this._setVars();
    this.toggleError(props);
  }

  onRemoved() {
    this.sankeyResetButton.removeEventListener('click', this.onSankeyReset);
  }

  _setVars() {
    this.el = document.querySelector('.js-tool-content');
    this.sidebar = document.querySelector('.js-map-sidebar');
    this.sankeyError = document.querySelector('.js-sankey-error');
    this.sankeyResetButton = document.querySelector('.js-sankey-reset');

    this.sankeyResetButton.addEventListener('click', this.onSankeyReset);
  }

  _resetSankey() {
    this.callbacks.resetSankey();
  }

  toggleError({ noLinksFound }) {
    this.sankeyError.classList.toggle('is-hidden', !noLinksFound);
  }
}
