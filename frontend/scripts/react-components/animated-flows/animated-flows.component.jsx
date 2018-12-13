/* eslint-disable camelcase,no-var,vars-on-top,no-shadow */
import React from 'react';
import PropTypes from 'prop-types';
import { select as d3_select, interval as d3_interval, easeLinear } from 'd3';

import Responsive from 'react-components/shared/responsive.hoc';
import d3_sankey from './sankey';
import energy from './energy.json';

import 'scripts/react-components/animated-flows/animated-flows.scss';

class AnimatedFlows extends React.PureComponent {
  componentDidUpdate() {
    this.build();
  }

  build() {
    const { width, height } = this.props;

    this.container.innerHTML = '';

    const svg = d3_select(this.container)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g');

    const sankey = d3_sankey(width)
      .nodeWidth(2)
      .nodePadding(10)
      .size([width, height]);

    const path = sankey.link();

    sankey
      .nodes(energy.nodes)
      .links(energy.links)
      .layout(32);

    function setDash() {
      const d3this = d3_select(this);
      const totalLength = d3this.node().getTotalLength();
      d3this
        .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
        .attr('stroke-dashoffset', totalLength);
    }

    var gradientLink = svg
      .append('g')
      .selectAll('.gradient-link')
      .data(energy.links)
      .enter()
      .append('path')
      .attr('class', 'gradient-link')
      .attr('d', path)
      .style('stroke-width', d => Math.max(1, d.dy))
      .sort((a, b) => b.dy - a.dy)
      .each(setDash)
      .style('stroke', () => {
        var id = 'c-000-to-000';
        if (!svg.select(id).node()) {
          var gradient = svg
            .append('defs')
            .append('linearGradient')
            .attr('id', id)
            .attr('x1', '0%')
            .attr('y1', '0%')
            .attr('x2', '100%')
            .attr('y2', '0%')
            .attr('spreadMethod', 'pad');

          gradient
            .append('stop')
            .attr('offset', '0%')
            .attr('stop-color', '#000')
            .attr('stop-opacity', 0.1);

          gradient
            .append('stop')
            .attr('offset', '100%')
            .attr('stop-color', '#000')
            .attr('stop-opacity', 0.3);
        }
        return `url(#${id})`;
      });

    svg
      .append('g')
      .selectAll('.link')
      .data(energy.links)
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('d', path)
      .style('stroke-width', d => Math.max(1, d.dy))
      .sort((a, b) => b.dy - a.dy);

    function branchAnimate(nodeData) {
      var links = svg
        .selectAll('.gradient-link')
        .filter(gradientD => nodeData.sourceLinks.indexOf(gradientD) > -1);
      var nextLayerNodeData = [];
      links.each(d => nextLayerNodeData.push(d.target));

      links
        .style('opacity', null)
        .transition()
        .duration(1500)
        .ease(easeLinear)
        .attr('stroke-dashoffset', 0)
        .on('end', () => nextLayerNodeData.forEach(d => branchAnimate(d)));
    }
    var node = svg
      .append('g')
      .selectAll('.node')
      .data(energy.nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.x}, ${d.y})`);

    function cleanBranches() {
      // cancel all transitions by making a new one
      gradientLink.transition();
      gradientLink.style('opacity', 0).each(function gradientSetDash(d) {
        setDash.call(this, d);
      });
    }

    function animateBranch() {
      const r = Math.floor(Math.random() * (energy.nodes.length + 1));
      var node = energy.nodes[r];
      if (node && node.sourceLinks.length > 0 && node.x === 0) {
        branchAnimate(node);
      } else {
        animateBranch();
      }
    }

    node
      .append('rect')
      .attr('height', d => d.dy)
      .attr('width', sankey.nodeWidth())
      .style('opacity', 0);

    animateBranch();
    d3_interval(() => {
      cleanBranches();
      animateBranch();
    }, 10000);
  }

  render() {
    return (
      <div
        ref={ref => {
          this.container = ref;
        }}
        className="c-animated-flows"
      />
    );
  }
}

AnimatedFlows.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number
};

export default Responsive({ debounceRate: 350 })(AnimatedFlows);
