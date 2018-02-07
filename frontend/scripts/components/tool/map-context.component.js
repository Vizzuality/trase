import ContextLayersTemplate from 'templates/tool/map/map-context.ejs';
import 'styles/components/shared/switcher.scss';
import 'styles/components/tool/map/map-context.scss';

export default class {
  onCreated() {
    this.el = document.querySelector('.js-map-context');
    this.items = document.querySelector('.js-map-context-items');
  }

  buildLayers({ layers, selectedMapContextualLayers }) {
    this.items.innerHTML = ContextLayersTemplate({ layers });

    if (layers.length > 0) {
      this.el.classList.remove('is-hidden');
    } else {
      this.el.classList.add('is-hidden');
    }

    this.callbacks.onMapDimensionsLoaded();

    this.switchers = Array.prototype.slice.call(this.items.querySelectorAll('.c-switcher'), 0);

    this.switchers.forEach(switcher => {
      switcher.addEventListener('click', e => this._onToggleSwitcher(e));
    });

    this.selectContextualLayers(selectedMapContextualLayers);
  }

  selectContextualLayers(selectedMapContextualLayers) {
    if (this.switchers === undefined) {
      return;
    }
    if (
      selectedMapContextualLayers !== undefined &&
      selectedMapContextualLayers !== null &&
      selectedMapContextualLayers.length
    ) {
      this._setActiveContextualLayers(selectedMapContextualLayers);
    }
  }

  _setActiveContextualLayers(selectedMapContextualLayers) {
    selectedMapContextualLayers.forEach(layerSlug => {
      this.switchers.forEach(switcher => {
        if (switcher.getAttribute('data-layer-slug') !== layerSlug) return;
        switcher.closest('.js-map-context-item').classList.add('-selected');
        switcher.classList.add('-enabled');
      });
    });
  }

  _onToggleSwitcher(e) {
    const switcher = e && e.currentTarget;
    if (!switcher) return;

    switcher.closest('.js-map-context-item').classList.toggle('-selected');
    switcher.classList.toggle('-enabled');

    const layers = this._getActivelayers();
    this.callbacks.onContextualLayerSelected(layers);
  }

  _getActivelayers() {
    const activeLayers = [];

    this.switchers.forEach(switcher => {
      if (!switcher.classList.contains('-enabled')) return;

      const layerSlug = switcher.getAttribute('data-layer-slug');
      activeLayers.push(layerSlug);
    });

    return activeLayers;
  }
}
