/* eslint-disable */
import React from 'react';
import { withFauxDOM } from 'react-faux-dom';
import * as d3 from 'd3';
import d3Sankey from './sankey';
import energy from './energy.json';

d3.sankey = d3Sankey;

class AnimatedFlows extends React.PureComponent {
  componentDidMount() {
    const width = parseInt(window.innerWidth);
    const height = parseInt(600);

    const component = this;

    const sankey = d3.sankey(width)
      .nodeWidth(2)
      .nodePadding(10)
      .size([width, height]);

    const path = sankey.link();

    sankey
      .nodes(energy.nodes)
      .links(energy.links)
      .layout(32);

    const chart = this.props.connectFauxDOM('div', 'chart');
    chart.setAttribute('class', 'flowsContainer');
    const svg = d3.select(chart).append("svg")
       .attr("width", width)
       .attr("height", height)
       .append("g");

    const gradientLink = svg.append("g")
      .selectAll(".gradient-link")
      .data(energy.links)
      .enter().append("path")
      .attr("class", "gradient-link")
      .attr("d", path)
      .style("stroke-width", d => Math.max(1, d.dy))
      .sort((a, b) => (b.dy - a.dy))
      .each(setDash)
      .style('stroke', (d) => {
        const id = 'c-000-to-000';
        if (!svg.select(id)._groups[0][0]) {
          const gradient = svg.append('defs')
            .append('linearGradient')
            .attr('id', id)
            .attr('x1', '0%')
            .attr('y1', '0%')
            .attr('x2', '100%')
            .attr('y2', '0%')
            .attr('spreadMethod', 'pad');

          gradient.append('stop')
            .attr('offset', '0%')
            .attr('stop-color', "#000")
            .attr('stop-opacity', .1);

          gradient.append('stop')
            .attr('offset', '100%')
            .attr('stop-color', "#000")
            .attr('stop-opacity', .3);
        }
        return "url(#" + id + ")";
      });

    const link = svg.append("g").selectAll(".link")
      .data(energy.links)
      .enter().append("path")
      .attr("class", "link")
      .attr("d", path)
      .style("stroke-width", d => Math.max(1, d.dy))
      .sort((a, b) => (b.dy - a.dy));

    const node = svg.append("g")
      .selectAll(".node")
      .data(energy.nodes)
      .enter().append("g")
      .attr("class", "node")
      .attr("transform", d => ("translate(" + d.x + "," + d.y + ")"));

    node.append("rect")
      .attr("height", d => (d.dy))
      .attr("width", sankey.nodeWidth())
      .style("opacity", 0);

    function setDash(d) {
      const d3this = d3.select(this);
      const totalLength = d3this.node().style
        .getProperty('totalLength');
      d3this
        .attr('stroke-dasharray', totalLength + ' ' + totalLength)
        .attr('stroke-dashoffset', totalLength)
    }

    function branchAnimate(nodeData) {

      const links = svg.selectAll(".gradient-link")
        .filter((gradientD) => (nodeData.sourceLinks.indexOf(gradientD) > -1));
      const nextLayerNodeData = [];
      links.each(d => nextLayerNodeData.push(d.target));

      links
        .style("opacity", null)
        .transition()
        .duration(1500)
        .ease(d3.easeLinear)
        .attr('stroke-dashoffset', 0)
        .on('end', () => {
          nextLayerNodeData.forEach(branchAnimate);
        });
    }

    function cleanBranches() {
      //cancel all transitions by making a new one
      if (component.props.isAnimatingFauxDOM()) {
        component.props.stopAnimatingFauxDOM();
      }
      gradientLink.transition();
      gradientLink
        .style("opacity", 0)
        .each(d => setDash.call(this, d));
    }

    function animateBranch() {
      if (!component.props.isAnimatingFauxDOM()) {
        component.props.animateFauxDOM(10100);
      }
      const r = Math.floor(Math.random() * (energy.nodes.length + 1));
      const node = energy.nodes[r];
      if (!!node.sourceLinks.length && node.x === 0) {
        branchAnimate(node);
      } else {
        animateBranch();
      }
    }

    animateBranch();

    setInterval(
      () => {
        cleanBranches();
        animateBranch();
      },
      10000
    );
  }

  render() {
    return (
      <div className="c-animated-flows">
        {this.props.chart}
      </div>
    );
  }
}

export default withFauxDOM(AnimatedFlows);
