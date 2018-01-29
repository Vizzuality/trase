/* eslint-disable */
import React from 'react';
import debounce from 'lodash/debounce';
import { select as d3_select, interval as d3_interval, easeLinear } from 'd3';
import d3_sankey from './sankey';
import energy from './energy.json';
import 'd3-transition';


class AnimatedFlows extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      width: null,
      height: null
    };

    this.build = this.build.bind(this);
    this.update = debounce(this.update.bind(this), 350);
  }

  componentDidMount() {
    window.addEventListener('resize', this.update);
    this.update();
  }

  componentDidUpdate() {
    this.build();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.build);
  }

  update() {
    const parent = this.container.parentNode;
    const { height, width } = window.getComputedStyle(parent);
    this.setState({
      width: parseInt(width, 10),
      height: parseInt(height, 10)
    })
  }

  build() {
    const { width, height } = this.state;
    this.container.innerHTML = '';

    var svg = d3_select(this.container)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g");

    var sankey = d3_sankey(width)
      .nodeWidth(2)
      .nodePadding(10)
      .size([width, height]);

    var path = sankey.link();

    sankey
      .nodes(energy.nodes)
      .links(energy.links)
      .layout(32);

    function setDash(d) {
      var d3this = d3_select(this);
      var totalLength = d3this.node().getTotalLength();
      d3this
        .attr('stroke-dasharray', totalLength + ' ' + totalLength)
        .attr('stroke-dashoffset', totalLength)
    }

    var gradientLink = svg.append("g").selectAll(".gradient-link")
      .data(energy.links)
      .enter().append("path")
      .attr("class", "gradient-link")
      .attr("d", path)
      .style("stroke-width", function(d) {
        return Math.max(1, d.dy);
      })
      .sort(function(a, b) {
        return b.dy - a.dy;
      })
      .each(setDash)
      .style('stroke', function(d) {
        var id = 'c-000-to-000';
        if (!svg.select(id).node()) {
          var gradient = svg.append('defs')
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

    var link = svg.append("g").selectAll(".link")
      .data(energy.links)
      .enter().append("path")
      .attr("class", "link")
      .attr("d", path)
      .style("stroke-width", function(d) {
        return Math.max(1, d.dy);
      })
      .sort(function(a, b) {
        return b.dy - a.dy;
      });

    function branchAnimate(nodeData) {
      var links = svg.selectAll(".gradient-link")
        .filter(function(gradientD) {
          return nodeData.sourceLinks.indexOf(gradientD) > -1
        });
      var nextLayerNodeData = [];
      links.each(function(d) {
        nextLayerNodeData.push(d.target);
      });

      links
        .style("opacity", null)
        .transition()
        .duration(1500)
        .ease(easeLinear)
        .attr('stroke-dashoffset', 0)
        .on('end', function() {
          nextLayerNodeData.forEach(function(d) {
            branchAnimate(d);
          });
        });
    }
    var node = svg.append("g").selectAll(".node")
      .data(energy.nodes)
      .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")";
      })

    function cleanBranches() {
      //cancel all transitions by making a new one
      gradientLink.transition();
      gradientLink
        .style("opacity", 0)
        .each(function(d) {
          setDash.call(this, d);
        });
    }

    function animateBranch() {
      var r = Math.floor(Math.random() * (energy.nodes.length + 1) + 0);
      var node = energy.nodes[r];
      if (node && node.sourceLinks.length > 0 && node.x === 0) {
        branchAnimate(node);
      } else {
        animateBranch();
      }
    }

    node.append("rect")
      .attr("height", function(d) {
        return d.dy;
      })
      .attr("width", sankey.nodeWidth())
      .style("opacity", 0);

    animateBranch();
    d3_interval(function(){
        cleanBranches();
        animateBranch()
      }
      , 10000);
    }

  render() {
    return (
      <div
        ref={ref => { this.container = ref; }}
        className="c-animated-flows"
      >
      </div>
    );
  }
}

export default AnimatedFlows;
