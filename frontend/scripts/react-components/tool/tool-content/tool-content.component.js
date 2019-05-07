export default class {
  onCreated() {
    this.onSankeyReset = this._resetSankey.bind(this);

    this._setVars();
  }

  _setVars() {
    this.el = document.querySelector('.js-tool-content');
    this.map = this.el.querySelector('.js-map-container');
    this.mapViewVeil = this.el.querySelector('.js-map-view-veil');
    this.sankeyError = document.querySelector('.js-sankey-error');
    this.sankeyResetButton = document.querySelector('.js-sankey-reset');

    this.sankeyResetButton.addEventListener('click', this.onSankeyReset);
  }

  _resetSankey() {
    this.callbacks.resetSankey();
  }

  showLoader({ loading }) {
    const toolLoading = document.querySelector('.js-tool-loading');
    if (toolLoading) toolLoading.classList.toggle('is-visible', loading);

    const map = document.querySelector('.c-map');
    map.classList.toggle('-smooth-transition', !loading);

    const sankey = document.querySelector('.c-sankey');
    sankey.classList.toggle('-smooth-transition', !loading);
  }

  toggleMapVisibility({ isMapVisible }) {
    this.el.classList.toggle('-center-map', isMapVisible);
    this.map.classList.toggle('-fullscreen', isMapVisible);
    this.mapViewVeil.classList.toggle('is-hidden', !isMapVisible);
  }

  toggleMapLayersVisibility({ isVisible }) {
    this.el.classList.toggle('-open', isVisible);
  }

  toggleError(hasError) {
    this.sankeyError.classList.toggle('is-hidden', !hasError);
  }
}
