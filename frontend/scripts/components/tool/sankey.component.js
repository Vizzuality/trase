/* eslint-disable camelcase,import/no-extraneous-dependencies,func-names */
import _ from 'lodash';
import { event as d3_event, select as d3_select } from 'd3-selection';
import 'd3-transition';
import { DETAILED_VIEW_MIN_LINK_HEIGHT, SANKEY_TRANSITION_TIME } from 'constants';
import formatValue from 'utils/formatValue';
import addSVGDropShadowDef from 'utils/addSVGDropShadowDef';
import sankeyLayout from 'components/tool/sankey.d3layout';
import Tooltip from 'components/shared/info-tooltip.component';
import 'styles/components/tool/sankey.scss';
import 'styles/components/tool/node-menu.scss';

const placeNodeText = node => `translate(0,${(-7 + (node.renderedHeight / 2)) - ((node.label.length - 1) * 7)})`;

export default class {
  onCreated() {
    this._build();
  }

  resizeViewport({
    selectedNodesIds,
    shouldRepositionExpandButton,
    selectedRecolorBy,
    currentQuant,
    sankeySize
  }) {
    this.layout.setViewportSize(sankeySize);

    if (this.layout.relayout()) {
      this._render(selectedRecolorBy, currentQuant);
      if (shouldRepositionExpandButton) this._repositionExpandButton(selectedNodesIds);
    }
  }

  showLoadedLinks(linksPayload) {
    if (linksPayload.links === null || !linksPayload.links.length) {
      return;
    }
    this.scrollContainer.classList.toggle('-detailed', linksPayload.detailedView);

    if (linksPayload.detailedView === false) {
      this.svg.style('height', '100%');
      this.scrollContainer.removeEventListener('scroll', this._onScrollBound);
    }

    this.layout.setViewportSize(linksPayload.sankeySize);
    this.layout.setLinksPayload(linksPayload);

    const relayout = this.layout.relayout();

    if (linksPayload.detailedView === true) {
      this.svg.style('height', `${this.layout.getMaxHeight()}px`);
      this.scrollContainer.addEventListener('scroll', this._onScrollBound);
    }

    if (relayout === false) {
      return;
    }

    this._render(linksPayload.selectedRecolorBy, linksPayload.currentQuant);

    this.selectNodes(linksPayload);
  }

  _onScroll() {
    this._repositionExpandButtonScroll();
  }

  selectNodes({ selectedNodesIds, shouldRepositionExpandButton }) {
    // let minimumY = Infinity;
    if (!this.layout.isReady()) {
      return;
    }

    this.sankeyColumns.selectAll('.sankey-node')
      .classed('-selected', node => selectedNodesIds.indexOf(node.id) > -1);

    if (shouldRepositionExpandButton) this._repositionExpandButton(selectedNodesIds);
  }

  toggleExpandButton(areNodesExpanded) {
    this.expandButton.classList.toggle('-expanded', areNodesExpanded);
  }

  highlightNodes(nodesIds) {
    this.sankeyColumns.selectAll('.sankey-node')
      .classed('-highlighted', node => nodesIds.indexOf(node.id) > -1);
  }

  _build() {
    this.layout = sankeyLayout()
      .columnWidth(100);

    this.el = document.querySelector('.js-sankey');
    this.scrollContainer = document.querySelector('.js-sankey-scroll-container');
    this.svg = d3_select('.js-sankey-canvas');
    this.sankeyColumns = this.svg.selectAll('.sankey-column');
    this.linksContainer = this.svg.select('.sankey-links');

    this.linkTooltip = new Tooltip('.js-sankey-tooltip');

    this.sankeyColumns.on('mouseleave', () => {
      this._onColumnOut();
    });

    addSVGDropShadowDef(this.svg);

    this.expandButton = document.querySelector('.js-expand');
    this.expandActionButton = document.querySelector('.js-expand-action');
    this.expandActionButton.addEventListener('click', this._onExpandClick.bind(this));
    this.clearButton = document.querySelector('.js-clear');
    this.clearButton.addEventListener('click', this.callbacks.onClearClick);

    this._onScrollBound = this._onScroll.bind(this);
  }

  _onExpandClick() {
    this.callbacks.onExpandClick();
  }

  _repositionExpandButton(nodesIds) {
    // TODO split by columns
    if (nodesIds && nodesIds.length > 0) {
      this.expandButton.classList.add('-visible');

      const lastSelectedNode = this.sankeyColumns.selectAll('.sankey-node')
        .filter(node => node.id === nodesIds[0])
        .data()[0];

      if (lastSelectedNode) {
        const selectedColumnFirstNode = this.sankeyColumns.selectAll('.sankey-node.-selected')
          .filter(node => node.x === lastSelectedNode.x)
          .data()
          .reduce((acc, val) => (acc.y < val.y ? acc : val));

        this.currentExpandButtonY = Math.max(0, selectedColumnFirstNode.y - 12);
        this.expandButtonIsVisible = true;
        this._repositionExpandButtonScroll();
        this.expandButton.style.left = `${selectedColumnFirstNode.x - 12}px`;
        return;
      }
    }
    this.expandButtonIsVisible = false;
    this.expandButton.classList.remove('-visible');
  }

  _repositionExpandButtonScroll() {
    const y = this.currentExpandButtonY - this.scrollContainer.scrollTop;
    this.expandButton.style.top = `${y}px`;
    this.expandButton.classList.toggle('-visible', y > -10 && this.expandButtonIsVisible === true);
  }

  _getLinkColor(link, selectedRecolorBy) {
    let classPath = 'sankey-link';
    if (!selectedRecolorBy) {
      return classPath;
    }

    if (selectedRecolorBy.name !== 'none') {
      if (link.recolorBy === null) {
        return classPath;
      }
      let recolorBy = link.recolorBy;
      if (selectedRecolorBy.divisor) {
        recolorBy = Math.floor(link.recolorBy / selectedRecolorBy.divisor);
      }
      const legendTypeClass = _.toLower(selectedRecolorBy.legendType);
      const legendColorThemeClass = _.toLower(selectedRecolorBy.legendColorTheme);
      classPath = `${classPath} -recolorby-${legendTypeClass}-${legendColorThemeClass}-${recolorBy}`;
    } else {
      classPath = `${classPath} -recolorgroup-${link.recolorGroup}`;
    }

    return classPath;
  }

  _render(selectedRecolorBy, currentQuant) {
    this.sankeyColumns
      .data(this.layout.columns());

    this.sankeyColumns.attr('transform', d => `translate(${d.x},0)`);

    this.nodes = this.sankeyColumns.select('.sankey-nodes')
      .selectAll('g.sankey-node')
      .data(column => column.values, node => node.id);

    const that = this;
    const nodesEnter = this.nodes.enter()
      .append('g')
      .attr('class', 'sankey-node')
      .attr('transform', node => `translate(0,${node.y})`)
      .classed('-is-aggregated', node => node.isAggregated)
      .classed('-is-domestic', node => node.isDomesticConsumption)
      .classed('-is-alone-in-column', node => node.isAloneInColumn)
      .on('mouseenter', node => that._onNodeOver(d3_select(this), node.id, node.isAggregated))
      .on('mouseleave', () => {
        this._onNodeOut();
      })
      .on('click', (node) => {
        this.callbacks.onNodeClicked(node.id, node.isAggregated);
      });

    nodesEnter.append('rect')
      .attr('class', 'sankey-node-rect')
      .attr('width', this.layout.columnWidth())
      .attr('height', d => d.renderedHeight);

    this._renderTitles(nodesEnter);

    this.nodes.selectAll('text').remove();
    this._renderTitles(this.nodes);

    this.nodes.classed('-is-alone-in-column', node => node.isAloneInColumn);

    const nodesUpdate = this.nodes.transition()
      .duration(SANKEY_TRANSITION_TIME)
      .attr('transform', d => `translate(0,${d.y})`);

    nodesUpdate.select('.sankey-node-rect')
      .attr('height', d => d.renderedHeight);


    this.nodes.exit()
      .remove();


    const linksData = this.layout.links();
    const links = this.linksContainer
      .selectAll('path')
      .data(linksData, link => link.id);

    // update
    links.attr('class', link => this._getLinkColor(link, selectedRecolorBy)); // apply color from CSS class immediately
    links.transition()
      .duration(SANKEY_TRANSITION_TIME)
      .attr('stroke-width', d => Math.max(DETAILED_VIEW_MIN_LINK_HEIGHT, d.renderedHeight))
      .attr('d', this.layout.link());

    this.currentSelectedRecolorBy = selectedRecolorBy;
    this.currentQuant = currentQuant;

    // enter
    links.enter()
      .append('path')
      .attr('class', link => this._getLinkColor(link, selectedRecolorBy))
      .attr('d', this.layout.link())
      .on('mouseover',
        function (link) {
          that._onLinkOver(link, this);
        })
      .on('mouseout',
        function () {
          that.linkTooltip.hide();
          this.classList.remove('-hover');
        })
      .transition()
      .duration(SANKEY_TRANSITION_TIME)
      .attr('stroke-width', d => Math.max(DETAILED_VIEW_MIN_LINK_HEIGHT, d.renderedHeight));

    // exit
    links.exit()
      .transition()
      .duration(SANKEY_TRANSITION_TIME)
      .attr('stroke-width', 0)
      .remove();
  }

  _renderTitles(selection) {
    selection.append('text')
      .attr('class', 'sankey-node-labels')
      .attr('transform', placeNodeText)
      .selectAll('tspan')
      .data(node => node.label)
      .enter()
      .append('tspan')
      .attr('class', 'sankey-node-label')
      .attr('x', this.layout.columnWidth() / 2)
      .attr('dy', 12)
      .text(d => d);
  }

  _onNodeOver(selection, nodeId, isAggregated) {
    this.callbacks.onNodeHighlighted(nodeId, isAggregated);
  }

  _onNodeOut() {
    this.sankeyColumns.selectAll('.sankey-node').classed('-highlighted', false);
  }

  _onLinkOver(link, linkEl) {
    const title = `${link.sourceNodeName} > ${link.targetNodeName}`;
    const values = [{
      title: this.currentQuant.name,
      unit: this.currentQuant.unit,
      value: formatValue(link.quant, this.currentQuant.name)
    }];

    if (this.currentSelectedRecolorBy && this.currentSelectedRecolorBy.name !== 'none') {
      values.push({
        title: this.currentSelectedRecolorBy.label,
        value: this._getLinkValue(link)
      });
    }

    this.linkTooltip.show(d3_event.pageX, d3_event.pageY, title, values);
    linkEl.classList.add('-hover');
  }

  _getLinkValue(link) {
    if (link.recolorBy === null) {
      return 'unknown';
    } else if (this.currentSelectedRecolorBy.type !== 'ind') {
      return _.capitalize(link.recolorBy);
    }

    if (this.currentSelectedRecolorBy.legendType === 'percentual') {
      // percentual values are always a range, not the raw value. The value coming from the model is already floored to the start of the bucket (splitLinksByColumn)
      const nextValue = link.recolorBy + this.currentSelectedRecolorBy.divisor;
      return `${link.recolorBy}–${nextValue}%`;
    }

    return `${link.recolorBy}/${this.currentSelectedRecolorBy.maxValue}`;
  }

  _onColumnOut() {
    this._onNodeOut();
    this.callbacks.onNodeHighlighted();
  }
}

