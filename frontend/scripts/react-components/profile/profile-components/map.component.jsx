/* eslint-disable camelcase,import/no-extraneous-dependencies */
import { select as d3_select, event as d3_event } from 'd3-selection';
import { json as d3_json } from 'd3-request';
import { geoPath as d3_geoPath, geoMercator as d3_geoMercator } from 'd3-geo';
import { geoRobinson as d3_geoRobinson } from 'd3-geo-projection';
import { feature as topojsonFeature } from 'topojson';
import isEqual from 'lodash/isEqual';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Responsive from 'react-components/shared/responsive.hoc';
import scrollOffset from 'utils/scroll-offset';

class Map extends Component {
  componentDidMount() {
    this.build();
  }

  shouldComponentUpdate(nextProps) {
    const {
      getPolygonClassName: cb1,
      hideTooltipCallback: cb2,
      showTooltipCallback: cb3,
      ...next
    } = nextProps;

    const {
      getPolygonClassName,
      hideTooltipCallback,
      showTooltipCallback,
      ...current
    } = this.props;

    return !isEqual(next, current);
  }

  componentDidUpdate() {
    this.build();
  }

  getFeaturesBox(featureBounds) {
    return {
      x: featureBounds[0][0],
      y: featureBounds[0][1],
      width: featureBounds[1][0] - featureBounds[0][0],
      height: featureBounds[1][1] - featureBounds[0][1]
    };
  }

  // fits the geometry layer inside the viewport
  fitGeoInside(featureBounds, width, height) {
    const bbox = this.getFeaturesBox(featureBounds);
    const scale = 1 / Math.max(bbox.width / width, bbox.height / height);
    const trans = [
      -((bbox.x + bbox.width / 2) * scale) + width / 2,
      -((bbox.y + bbox.height / 2) * scale) + height / 2
    ];

    return { scale, trans };
  }

  build() {
    const {
      width,
      height,
      testId,
      topoJSONPath,
      topoJSONRoot,
      getPolygonTestId,
      getPolygonClassName,
      showTooltipCallback,
      hideTooltipCallback,
      useRobinsonProjection,
    } = this.props;

    this.element.innerHTML = '';

    if (!width || !height) return;

    const d3Container = d3_select(this.element);

    const svg = d3Container
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    const geoParent = svg.append('g').attr('data-test', testId);
    const container = geoParent.append('g');
    const projection = useRobinsonProjection === true ? d3_geoRobinson() : d3_geoMercator();

    const path = d3_geoPath().projection(projection);
    d3_json(topoJSONPath, (error, topoJSON) => {
      if (!topoJSON) return;
      const features = topojsonFeature(topoJSON, topoJSON.objects[topoJSONRoot]);
      // Filter Antartica
      const filteredFeatures = features.features.filter(f => f.properties.iso2 !== 'AQ');
      const polygons = container
        .selectAll('path')
        .data(filteredFeatures)
        .enter()
        .append('path')
        .attr('class', d => `polygon ${getPolygonClassName(d)}`)
        .attr('data-test', d => getPolygonTestId && getPolygonTestId(d, testId))
        .attr('d', path);

      if (showTooltipCallback !== undefined) {
        polygons
          .on('mousemove', d => {
            showTooltipCallback(
              d,
              d3_event.clientX + 10,
              d3_event.clientY + scrollOffset() + 10
            );
          })
          .on('mouseout', () => {
            hideTooltipCallback();
          });
      }

      const collection = {
        type: 'FeatureCollection',
        features: filteredFeatures
      };
      const featureBounds = path.bounds(collection);
      const { scale, trans } = this.fitGeoInside(featureBounds, width, height);

      container.attr('transform', [`translate(${trans})`, `scale(${scale})`].join(' '));

      container.selectAll('path').style('stroke-width', 0.5 / scale);
    });
  }

  render() {
    return (
      <div
        ref={elem => {
          this.element = elem;
        }}
      />
    );
  }
}

Map.propTypes = {
  width: PropTypes.number,
  testId: PropTypes.string,
  height: PropTypes.number,
  topoJSONPath: PropTypes.string,
  topoJSONRoot: PropTypes.string,
  getPolygonTestId: PropTypes.func,
  getPolygonClassName: PropTypes.func,
  showTooltipCallback: PropTypes.func,
  hideTooltipCallback: PropTypes.func,
  useRobinsonProjection: PropTypes.bool
};

export default Responsive({ debounceRate: 1000 })(Map);
