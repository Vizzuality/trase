import LegendChoroTemplate from 'templates/tool/map/legend-choro.ejs';
import LegendContextTemplate from 'templates/tool/map/legend-context.ejs';
import 'styles/components/tool/map/map-legend.scss';
import abbreviateNumber from 'utils/abbreviateNumber';

export default class {
  onCreated() {
    this.el = document.querySelector('.js-map-legend');
    this.el.addEventListener('click', () => {
      this.callbacks.onToggleMapLayerMenu();
    });
    this.choro = document.querySelector('.js-map-legend-choro');
    this.context = document.querySelector('.js-map-legend-context');
    this.map = document.querySelector('.c-map');
    this.attribution = document.querySelector('.js-map-attribution');
    this.mapControlScale = document.querySelector('.leaflet-control-scale');
    this.warningsContainer = document.querySelector('.js-map-warnings-container');
    this.warnings = document.querySelector('.js-map-warnings');

    const zoom = document.querySelector('.leaflet-control-zoom');
    const scale = document.querySelector('.leaflet-control-scale');
    zoom.addEventListener('mouseenter', () => {
      scale.classList.toggle('-visible', true);
    });
    zoom.addEventListener('mouseleave', () => {
      scale.classList.toggle('-visible', false);
    });
  }

  updateChoroplethLegend({ choroplethLegend, selectedMapContextualLayersData }) {
    this._toggleLegend(choroplethLegend, selectedMapContextualLayersData);
    this._setupChoro(choroplethLegend);
    this._updateMapControlsPosition(choroplethLegend);
  }

  updateContextLegend({ choroplethLegend, selectedMapContextualLayersData }) {
    this._toggleLegend(choroplethLegend, selectedMapContextualLayersData);
    this._renderContext(selectedMapContextualLayersData);
    this._updateMapControlsPosition(choroplethLegend);
  }

  highlightChoroplethBucket(bucketClass) {
    if (this.currentBuckets === undefined) {
      return;
    }
    for (let i = 0; i < this.currentBuckets.length; i++) {
      this.currentBuckets[i].classList.toggle('-highlighted', false);
    }
    if (bucketClass === undefined || bucketClass === null) {
      return;
    }
    const bucket = this.choro.getElementsByClassName(
      `color-${bucketClass.substr(1).toLowerCase()}`
    )[0];
    if (bucket === undefined) {
      return;
    }
    bucket.classList.toggle('-highlighted', true);
  }

  selectMapDimensions(selectedMapDimensionsWarnings) {
    this.warningsContainer.classList.toggle('-visible', selectedMapDimensionsWarnings !== null);
    if (selectedMapDimensionsWarnings !== null) {
      this.warnings.innerHTML = selectedMapDimensionsWarnings;
    }
  }

  _setupChoro(choroplethLegend) {
    if (this.el.hasChildNodes()) {
      this._cleanChoro();
    }

    if (choroplethLegend !== null) {
      this._renderChoro(choroplethLegend);
    }
  }

  _toggleLegend(choroplethLegend, selectedMapContextualLayersData) {
    if (
      choroplethLegend === null &&
      (selectedMapContextualLayersData === undefined || !selectedMapContextualLayersData.length)
    ) {
      this._hideLegend();
    } else {
      this._showLegend();
    }
  }

  _showLegend() {
    this.el.classList.remove('-hidden');
  }

  _hideLegend() {
    this.el.classList.add('-hidden');
  }

  _cleanChoro() {
    this.choro.innerHTML = '';
  }

  _renderChoro(choroplethLegend) {
    const cssClass = choroplethLegend.isBivariate ? '-bidimensional' : '-horizontal';

    this.choro.innerHTML = LegendChoroTemplate({
      title: choroplethLegend.titles,
      colors: choroplethLegend.colors,
      cssClass,
      bucket: choroplethLegend.bucket,
      isBivariate: choroplethLegend.isBivariate,
      abbreviateNumber
    });

    this.currentBuckets = Array.prototype.slice
      .call(this.choro.getElementsByClassName('bucket'))
      .concat(Array.prototype.slice.call(this.choro.getElementsByClassName('bullet')));
  }

  _renderContext(layers) {
    this.context.innerHTML = LegendContextTemplate({
      layers
    });
  }

  _updateMapControlsPosition(legend) {
    if (this.mapControlScale) {
      this.mapControlScale.classList.remove('-bivariate-legend');
      this.mapControlScale.classList.remove('-simple-legend');
    }
    if (legend) {
      const className = legend.isBivariate ? '-bivariate-legend' : '-simple-legend';
      if (this.mapControlScale) this.mapControlScale.classList.add(className);
    }
  }
}
