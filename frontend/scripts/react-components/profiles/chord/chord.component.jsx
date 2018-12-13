/* eslint-disable camelcase,import/no-extraneous-dependencies */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { select as d3_select } from 'd3-selection';
import { chord as d3_chord, ribbon as d3_ribbon } from 'd3-chord';
import { descending as d3_descending } from 'd3-array';
import { arc as d3_arc } from 'd3-shape';
import { translateText } from 'utils/transifex';

import './chord.scss';

const TYPE_KEY_1 = 'list';
const TYPE_KEY_2 = 'list2';

class Chord extends Component {
  constructor(props) {
    super(props);

    this.key = `chord_${new Date().getTime()}`;
  }

  componentDidMount() {
    this.build();
  }

  componentDidUpdate() {
    this.build();
  }

  build() {
    const { orgMatrix, list, list2 } = this.props;
    const parentWidth = this.props.width;
    const parentHeight = this.props.height;

    const nodes = [].concat(
      list.map(item => ({
        name: item.name,
        type: TYPE_KEY_1
      })),
      list2.map(item => ({
        name: item.name,
        type: TYPE_KEY_2
      }))
    );
    if (!orgMatrix.length || !nodes.length) {
      return;
    }

    const nameLimit = 11;
    const allNames = nodes.map(node => {
      if (node.name.length > nameLimit) {
        node.name = `${node.name.substring(0, nameLimit)}...`;
      }
      return node;
    });

    const margin = {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    };

    const width = parentWidth - margin.left - margin.right;
    const height = parentHeight - margin.top - margin.bottom;

    const outerRadius = Math.min(490, 490) * 0.5 - 40;
    const innerRadius = outerRadius - 12;

    const svgElement = document.querySelector(`.${this.key}`);
    svgElement.innerHTML = '';

    const svg = d3_select(svgElement)
      .attr('width', parentWidth)
      .attr('height', parentHeight);

    const chord = d3_chord()
      .padAngle(0.05)
      .sortSubgroups(d3_descending);

    const arc = d3_arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius);

    const ribbon = d3_ribbon().radius(innerRadius);

    const xTranslate = width / 2 + margin.left;
    const yTranslate = height / 2 + margin.top;

    const container = svg
      .append('g')
      .attr('transform', `translate(${xTranslate}, ${yTranslate})`)
      .datum(chord(orgMatrix));

    const group = container
      .append('g')
      .attr('class', 'groups')
      .selectAll('g')
      .data(chords => chords.groups)
      .enter()
      .append('g');

    group
      .append('path')
      .attr('d', arc)
      .attr('class', (d, i) => {
        if (i === 0) {
          return 'arc-current';
        }
        if (allNames[i].type === TYPE_KEY_2) {
          return 'arc-active';
        }
        return 'arc-default';
      });

    container
      .append('g')
      .attr('class', 'ribbons')
      .selectAll('path')
      .data(chords => chords.filter(filterChord => filterChord.source.index === 0))
      .enter()
      .append('path')
      .attr('d', ribbon)
      .attr('class', 'links');

    group
      .append('text')
      .each(d => {
        d.angle = (d.startAngle + d.endAngle) / 2;
      })
      .attr('dy', '.35em')
      .attr('class', 'text-legend')
      // eslint-disable-next-line max-len
      .attr(
        'transform',
        d =>
          `rotate(${(d.angle * 180) / Math.PI - 90}) translate(${innerRadius + 24}) ${
            d.angle > Math.PI ? 'rotate(180)' : ''
          }`
      )
      .style('text-anchor', d => (d.angle > Math.PI ? 'end' : null))
      .text((d, i) =>
        i === 0 || allNames[i].type === TYPE_KEY_2 ? translateText(allNames[i].name) : ''
      );
  }

  render() {
    return (
      <div className="c-chord">
        <svg className={this.key} />
        <div className="c-chord-legend">
          Other municipalities
          <br />
          in {this.props.name}
        </div>
      </div>
    );
  }
}

Chord.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  orgMatrix: PropTypes.array,
  list: PropTypes.array,
  list2: PropTypes.array,
  name: PropTypes.string
};

export default Chord;
