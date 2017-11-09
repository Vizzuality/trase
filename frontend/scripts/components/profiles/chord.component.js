import { select as d3_select } from 'd3-selection';
import { chord as d3_chord, ribbon as d3_ribbon } from 'd3-chord';
import { descending as d3_descending } from 'd3-array';
import { arc as d3_arc } from 'd3-shape';

import 'styles/components/profiles/chord.scss';

const TYPE_KEY_1 = 'list';
const TYPE_KEY_2 = 'list2';

export default class {
  constructor(className, orgMatrix, list, list2) {
    const nodes = [].concat(list.map(item => {
      return {
        name: item.name,
        type: TYPE_KEY_1
      };
    }), list2.map(item => {
      return {
        name: item.name,
        type: TYPE_KEY_2
      };
    }));
    if (!orgMatrix.length || !nodes.length) {
      return;
    }

    document.querySelector(className).classList.remove('is-hidden');
    const nameLimit = 11;
    const allNames = nodes.map(node => {
      if (node.name.length > nameLimit) {
        node.name = `${node.name.substring(0, nameLimit)}...`;
      }
      return node;
    });

    const elem = document.querySelector(className);
    const margin = {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    };
    const width = elem.clientWidth - margin.left - margin.right;
    const height = elem.clientWidth - margin.top - margin.bottom;

    const outerRadius = Math.min(490, 490) * 0.5 - 40;
    const innerRadius = outerRadius - 12;

    const svg = d3_select(className)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom);

    const chord = d3_chord()
      .padAngle(0.05)
      .sortSubgroups(d3_descending);

    const arc = d3_arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius);

    const ribbon = d3_ribbon()
      .radius(innerRadius);

    const xTranslate = (width / 2) + margin.left;
    const yTranslate = (height / 2) + margin.top;

    const container = svg.append('g')
      .attr('transform', `translate(${xTranslate}, ${yTranslate})`)
      .datum(chord(orgMatrix));

    const group = container.append('g')
      .attr('class', 'groups')
      .selectAll('g')
      .data((chords) => chords.groups)
      .enter().append('g');

    group.append('path')
      .attr('d', arc)
      .attr('class', (d, i) => {
        if (i === 0) {
          return 'arc-current';
        } else if (allNames[i].type === TYPE_KEY_2) {
          return 'arc-active';
        } else {
          return 'arc-default';
        }
      });

    container.append('g')
      .attr('class', 'ribbons')
      .selectAll('path')
      .data((chords) => chords.filter(chord => chord.source.index === 0))
      .enter().append('path')
      .attr('d', ribbon)
      .attr('class', 'links');

    group.append('text')
      .each(d => {
        d.angle = (d.startAngle + d.endAngle) / 2;
      })
      .attr('dy', '.35em')
      .attr('class', 'text-legend')
      .attr('transform', d => {
        return `rotate(${d.angle * 180 / Math.PI - 90}) translate(${innerRadius + 24}) ${d.angle > Math.PI ? 'rotate(180)' : ''}`;
      })
      .style('text-anchor', d => d.angle > Math.PI ? 'end' : null)
      .text((d, i) => (i === 0 || allNames[i].type === TYPE_KEY_2) ? allNames[i].name : '');
  }
}
