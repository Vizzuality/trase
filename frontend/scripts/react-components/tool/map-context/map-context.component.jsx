import ContextLayersTemplate from 'legacy/map-context.ejs';
import 'styles/components/shared/switcher.scss';
import 'styles/components/tool/map/map-context.scss';

export default class {
  constructor() {
    this.el = document.querySelector('.js-map-context');
    this.items = document.querySelector('.js-map-context-items');
    this.switchers = [];
  }

  onCreated(props) {
    this._onToggleSwitcher = e => {
      const switcher = e && e.currentTarget;
      if (!switcher) return;

      switcher.closest('.js-map-context-item').classList.toggle('-selected');
      switcher.classList.toggle('-enabled');

      const layers = this._getActivelayers();
      this.callbacks.onContextualLayerSelected(layers);
    };

    this.buildLayers(props);
  }

  onRemoved() {
    this.switchers.forEach(switcher => {
      switcher.removeEventListener('click', this._onToggleSwitcher);
    });
  }

  buildLayers({ layers, selectedMapContextualLayers }) {
    this.items.innerHTML = ContextLayersTemplate({ layers: Object.values(layers) });

    if (Object.values(layers).length > 0) {
      this.el.classList.remove('is-hidden');
    } else {
      this.el.classList.add('is-hidden');
    }

    this.callbacks.onMapDimensionsLoaded();

    this.switchers = Array.prototype.slice.call(this.items.querySelectorAll('.c-switcher'), 0);

    this.switchers.forEach(switcher => {
      switcher.addEventListener('click', this._onToggleSwitcher);
    });

    this.selectContextualLayers({ selectedMapContextualLayers });
  }

  selectContextualLayers({ selectedMapContextualLayers }) {
    if (this.switchers === undefined) {
      return;
    }
    if (selectedMapContextualLayers?.length > 0) {
      this._setActiveContextualLayers({ selectedMapContextualLayers });
    }
  }

  _setActiveContextualLayers({ selectedMapContextualLayers }) {
    selectedMapContextualLayers.forEach(layerSlug => {
      this.switchers.forEach(switcher => {
        const switcherSlug = switcher.getAttribute('data-layer-slug');
        // make sure ids parsed as numbers match switcherSlug
        if (switcherSlug && switcherSlug.toString() === layerSlug.toString()) {
          switcher.closest('.js-map-context-item').classList.add('-selected');
          switcher.classList.add('-enabled');
        }
      });
    });
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
