import ReactDOMServer from 'react-dom/server';
import React from 'react';

import ChoroArrow from 'react-components/tool/choro-arrow/choro-arrow.component';
import LegendChoroTemplate from 'templates/tool/map/legend-choro.ejs';
import LegendContextTemplate from 'templates/tool/map/legend-context.ejs';
import abbreviateNumber from 'utils/abbreviateNumber';

import 'styles/components/tool/map/map-legend.scss';

export default class {
  constructor() {
    this.el = document.querySelector('.js-map-legend');
    this.choro = document.querySelector('.js-map-legend-choro');
    this.context = document.querySelector('.js-map-legend-context');
  }

  onCreated(props) {
    this.updateChoroplethLegend(props);
    this.highlightChoroplethBucket(props);
    this.highlightChoroplethBucket(props);
  }

  updateChoroplethLegend({ choroplethLegend, selectedMapContextualLayersData }) {
    this._toggleLegend(choroplethLegend, selectedMapContextualLayersData);
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

  _renderChoro(choroplethLegend) {
    const cssClasses = [];
    cssClasses.push(choroplethLegend.isBivariate ? '-bidimensional' : '-horizontal');

    if (!choroplethLegend.isBivariate && choroplethLegend.bucket[0].length >= 7) {
      cssClasses.push('-wide');
    }

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
    this.context.innerHTML = LegendContextTemplate({
      layers
    });
  }
}
