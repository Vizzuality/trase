import BasemapsTemplate from 'templates/tool/map/map-basemaps.ejs';
import 'styles/components/tool/map/map-basemaps.scss';

export default class {

  onCreated() {
    this.el = document.querySelector('.js-map-basemaps-items');
  }

  buildBasemaps(basemaps) {
    this.el.innerHTML = BasemapsTemplate({ basemaps });

    this.basemaps = Array.prototype.slice.call(this.el.querySelectorAll('.js-map-sidebar-group-item'), 0);
    this.basemaps.forEach((basemap) => {
      basemap.addEventListener('click', (e) => this._onBasemapClicked(e));
    });
  }

  selectBasemap({ basemapId, disabled }) {
    this.el.classList.toggle('-disabled', disabled);
    this._setActiveBasemap(basemapId);
  }

  _setActiveBasemap(basemapId) {
    this.basemaps.forEach((basemap) => {
      basemap.classList.toggle('-selected', basemap.getAttribute('data-value') === basemapId);
    });
  }

  _onBasemapClicked(event) {
    const selectedRadio = event.currentTarget;
    const value = selectedRadio.getAttribute('data-value');
    this.callbacks.onMapBasemapSelected(value);
  }
}
