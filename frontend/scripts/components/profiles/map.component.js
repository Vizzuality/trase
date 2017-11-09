import { select as d3_select, event as d3_event } from 'd3-selection';
import { json as d3_json } from 'd3-request';
import { geoPath as d3_geoPath, geoMercator as d3_geoMercator } from 'd3-geo';
import { geoRobinson as d3_geoRobinson } from 'd3-geo-projection';
import * as topojson from 'topojson';

function getFeaturesBox(featureBounds) {
  return {
    x: featureBounds[0][0],
    y: featureBounds[0][1],
    width: featureBounds[1][0] - featureBounds[0][0],
    height: featureBounds[1][1] - featureBounds[0][1]
  };
}

// fits the geometry layer inside the viewport
function fitGeoInside(featureBounds, width, height) {
  const bbox = getFeaturesBox(featureBounds);
  const scale = 1 / Math.max(bbox.width / width, bbox.height / height);
  const trans = [-(bbox.x + bbox.width / 2) * scale + width / 2, -(bbox.y + bbox.height / 2) * scale + height / 2];

  return { scale, trans };
}

export default (className, { topoJSONPath, topoJSONRoot, getPolygonClassName, showTooltipCallback, hideTooltipCallback, useRobinsonProjection }) => {
  const d3Container =  d3_select(className);
  d3Container.node().classList.remove('-with-legend');
  const containerComputedStyle = window.getComputedStyle(d3Container.node());
  const width = parseInt(containerComputedStyle.width);
  const height = parseInt(containerComputedStyle.height);

  const svg = d3Container.append('svg')
    .attr('width', width)
    .attr('height', height);

  const geoParent = svg.append('g');
  const container = geoParent.append('g');

  const projection = (useRobinsonProjection === true) ? d3_geoRobinson() : d3_geoMercator();
  const path = d3_geoPath()
    .projection(projection);

  d3_json(topoJSONPath, function(error, topoJSON) {
    const features = topojson.feature(topoJSON, topoJSON.objects[topoJSONRoot]);

    const polygons = container.selectAll('path')
      .data(features.features)
      .enter()
      .append('path')
      .attr('class', d => {
        return `polygon ${getPolygonClassName(d)}`;
      })
      .attr('d', path);

    if (showTooltipCallback !== undefined) {
      polygons.on('mousemove', function(d) {
        showTooltipCallback(d, d3_event.clientX + 10, d3_event.clientY + window.scrollY + 10);
      } )
      .on('mouseout', function() {
        hideTooltipCallback();
      });
    }

    const collection = {
      'type': 'FeatureCollection',
      'features' : features.features
    };
    const featureBounds = path.bounds(collection);
    const { scale, trans } = fitGeoInside(featureBounds, width, height);

    container.attr('transform', [
      'translate(' + trans + ')',
      'scale(' + scale + ')'
    ].join(' '));

    container.selectAll('path').style('stroke-width', .5 / scale);
  });
};
