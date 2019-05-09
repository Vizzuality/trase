import BasemapsTemplate from 'templates/tool/map/map-basemaps.ejs';
import 'styles/components/tool/map/map-basemaps.scss';

export default class MapBasemaps {
  constructor() {
    this.el = document.querySelector('.js-map-basemaps-items');
    this.basemaps = [];
    this.clickBasemap = e => this._onBasemapClicked(e);
  }

  onCreated(props) {
    const { basemaps, disabled, activeBasemapId } = props;
    this.buildBasemaps({ basemaps });
    this.enableBasemapSelection({ disabled });
    this.selectBasemap({ activeBasemapId });
  }

  onRemoved() {
    this.basemaps.forEach(basemap => {
      basemap.removeEventListener('click', this.clickBasemap);
    });
  }

  buildBasemaps({ basemaps }) {
    this.el.innerHTML = BasemapsTemplate({ basemaps });

    this.basemaps = Array.prototype.slice.call(
      this.el.querySelectorAll('.js-map-sidebar-group-item'),
      0
    );
    this.basemaps.forEach(basemap => {
      basemap.addEventListener('click', this.clickBasemap);
    });
  }

  enableBasemapSelection({ disabled = false }) {
    this.el.classList.toggle('-disabled', disabled);
  }

  selectBasemap({ activeBasemapId }) {
    this.basemaps.forEach(basemap => {
      basemap.classList.toggle('-selected', basemap.getAttribute('data-value') === activeBasemapId);
    });
  }

  _onBasemapClicked(event) {
    const selectedRadio = event.currentTarget;
    const value = selectedRadio.getAttribute('data-value');
    this.callbacks.onMapBasemapSelected(value);
  }
}
