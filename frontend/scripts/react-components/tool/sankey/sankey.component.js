/* eslint-disable camelcase,import/no-extraneous-dependencies,func-names */
import capitalize from 'lodash/capitalize';
import startCase from 'lodash/startCase';
import { event as d3_event } from 'd3-selection';
import formatValue from 'utils/formatValue';
import Tooltip from 'components/shared/info-tooltip.component';
import 'styles/components/tool/sankey.scss';

export default class {
  onCreated(props) {
    this._build();
    this.resizeViewport(props);
    this.translateNodes(props);
  }

  translateNodes(relayoutOptions) {
    this._relayout(relayoutOptions);
  }

  resizeViewport({ sankeySize }) {
    this.layout.setViewportSize(sankeySize);
  }

  _build() {
    this.linkTooltip = new Tooltip('.js-sankey-tooltip');
  }

  _render() {
    // enter
    const links = [];
    const that = this;
    links
      .enter()
      .append('path')
      .on('mouseover', function(link) {
        that._onLinkOver(link, this);
      })
      .on('mouseout', () => this.linkTooltip.hide());
  }

  _onLinkOver(link) {
    const title = `${link.sourceNodeName} > ${link.targetNodeName}`;
    const values = [
      {
        title: this.selectedResizeBy.label,
        unit: this.selectedResizeBy.unit,
        value: formatValue(link.quant, this.selectedResizeBy.label)
      }
    ];

    if (this.currentSelectedRecolorBy) {
      values.push({
        title: this.currentSelectedRecolorBy.label,
        value: this._getLinkValue(link)
      });
    }

    this.linkTooltip.show(d3_event.pageX, d3_event.pageY, title, values);
  }

  _getLinkValue(link) {
    if (link.recolorBy === null) {
      return 'Unknown';
    }
    if (this.currentSelectedRecolorBy.type !== 'ind') {
      return capitalize(startCase(link.recolorBy));
    }

    if (this.currentSelectedRecolorBy.legendType === 'percentual') {
      // percentual values are always a range, not the raw value. The value coming from the model is already floored to the start of the bucket (splitLinksByColumn)
      const nextValue = link.recolorBy + this.currentSelectedRecolorBy.divisor;
      return `${link.recolorBy}–${nextValue}%`;
    }

    return `${link.recolorBy}/${this.currentSelectedRecolorBy.maxValue}`;
  }
}
