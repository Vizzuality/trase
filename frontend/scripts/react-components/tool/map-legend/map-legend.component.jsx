import ReactDOMServer from 'react-dom/server';
import React from 'react';

import ChoroArrow from 'react-components/tool/choro-arrow/choro-arrow.component';
import LegendChoroTemplate from 'templates/tool/map/legend-choro.ejs';
import LegendContextTemplate from 'templates/tool/map/legend-context.ejs';
import 'styles/components/tool/map/map-legend.scss';
import abbreviateNumber from 'utils/abbreviateNumber';

export default class {
  constructor() {
    this.el = document.querySelector('.js-map-legend');
    this.choro = document.querySelector('.js-map-legend-choro');
    this.context = document.querySelector('.js-map-legend-context');
    this.map = document.querySelector('.c-map');
    this.attribution = document.querySelector('.js-map-attribution');
    this.mapControlScale = document.querySelector('.leaflet-control-scale');
    this.warningsContainer = document.querySelector('.js-map-warnings-container');
    this.warnings = document.querySelector('.js-map-warnings');
    this.zoom = document.querySelector('.leaflet-control-zoom');
    const scale = document.querySelector('.leaflet-control-scale');

    this.showScale = () => {
      scale.classList.toggle('-visible', true);
    };
    this.hideScale = () => {
      scale.classList.toggle('-visible', false);
    };

    this.zoom.addEventListener('mouseenter', () => {
      scale.classList.toggle('-visible', true);
    });
    this.zoom.addEventListener('mouseleave', () => {
      scale.classList.toggle('-visible', false);
    });
  }

  onCreated(props) {
    this.updateChoroplethLegend(props);
    this.updateContextLegend(props);
    this.highlightChoroplethBucket(props);
    this.selectMapDimensions(props);
    this.highlightChoroplethBucket(props);
  }

  onRemoved() {
    this.zoom.removeEventListener('mouseenter', this.showScale);
    this.zoom.removeEventListener('mouseleave', this.hideScale);
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

  highlightChoroplethBucket({ currentHighlightedChoroplethBucket }) {
    if (this.currentBuckets === undefined) {
      return;
    }
    for (let i = 0; i < this.currentBuckets.length; i++) {
      this.currentBuckets[i].classList.toggle('-highlighted', false);
    }
    if (
      currentHighlightedChoroplethBucket === undefined ||
      currentHighlightedChoroplethBucket === null
    ) {
      return;
    }
    const bucket = this.choro.getElementsByClassName(
      `color-${currentHighlightedChoroplethBucket.substr(1).toLowerCase()}`
    )[0];
    if (bucket === undefined) {
      return;
    }
    bucket.classList.toggle('-highlighted', true);
  }

  selectMapDimensions({ selectedMapDimensionsWarnings }) {
    if (this.warningsContainer) {
      this.warningsContainer.classList.toggle('-visible', selectedMapDimensionsWarnings !== null);
    }
    if (selectedMapDimensionsWarnings !== null) {
      this.warnings.innerHTML = selectedMapDimensionsWarnings;
    }
  }

  _setupChoro(choroplethLegend) {
    if (this.el?.hasChildNodes()) {
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
    if (this.el) {
      this.el.classList.remove('-hidden');
    }
  }

  _hideLegend() {
    if (this.el) {
      this.el.classList.add('-hidden');
    }
  }

  _cleanChoro() {
    this.choro.innerHTML = '';
  }

  _renderChoro(choroplethLegend) {
    const cssClasses = [];
    cssClasses.push(choroplethLegend.isBivariate ? '-bidimensional' : '-horizontal');

    if (!choroplethLegend.isBivariate && choroplethLegend.bucket[0].length >= 7) {
      cssClasses.push('-wide');
    }
    if (this.choro) {
      this.choro.innerHTML = LegendChoroTemplate({
        title: choroplethLegend.titles,
        colors: choroplethLegend.colors,
        cssClass: cssClasses.join(' '),
        bucket: choroplethLegend.bucket,
        isBivariate: choroplethLegend.isBivariate,
        abbreviateNumber
      });

      this.currentBuckets = Array.prototype.slice
        .call(this.choro.getElementsByClassName('bucket'))
        .concat(Array.prototype.slice.call(this.choro.getElementsByClassName('bullet')));
    }

    const choroArrow = document.querySelector('.js-choro-arrow');

    if (!choroArrow) return;

    if (!choroplethLegend.isBivariate) {
      choroArrow.innerHTML = ReactDOMServer.renderToStaticMarkup(
        <ChoroArrow ticks={choroplethLegend.bucket[0].length} width={choroArrow.clientWidth} />
      );
    } else {
      choroArrow.innerHTML = '';
    }
  }

  _renderContext(layers) {
    if (this.context) {
      this.context.innerHTML = LegendContextTemplate({
        layers
      });
    }
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
