import formatValue from 'utils/formatValue';
import NodeTitleTemplate from 'templates/tool/nodeTitle.ejs';
import Tooltip from 'components/shared/info-tooltip.component';
import getNodeMeta from 'reducers/helpers/getNodeMeta';

import 'scripts/react-components/tool/tool-search/node-title-group/node-title-group.scss';
import 'styles/components/tool/nodes-clear.scss';

export default class {
  constructor() {
    this.el = document.querySelector('.js-nodes-titles');
    this.container = this.el.querySelector('.js-nodes-titles-container');
    this.clear = this.el.querySelector('.js-nodes-titles-clear');
    this.tooltip = new Tooltip('.js-node-tooltip');
    this.nodeTitleLinks = [];
    this.nodeTitleCloseButtons = [];

    this._onNodeTitleClickBound = this._onNodeTitleClick.bind(this);
    this._onNodeTitleCloseClickBound = this._onNodeTitleCloseClick.bind(this);
  }

  onCreated(props) {
    this.clear.addEventListener('click', this.callbacks.onClearClick);
    this.selectNodes(props);
    this.highlightNode(props);
  }

  onRemoved() {
    this.clear.removeEventListener('click', this.callbacks.onClearClick);
    this.nodeTitleLinks.forEach(nodeTitle => {
      nodeTitle.removeEventListener('click', this._onNodeTitleClickBound);
    });

    this.nodeTitleCloseButtons.forEach(closeButton => {
      closeButton.removeEventListener('click', this._onNodeTitleCloseClickBound);
    });
  }

  selectNodes(data) {
    const {
      selectedNodesData,
      columns,
      selectedMapDimensions,
      recolorGroups,
      selectedYears,
      nodeHeights,
      attributes,
      selectedResizeBy,
      selectedContextId,
      highlightedNodesData
    } = data;

    const hasHighlighted = highlightedNodesData.length > 0;
    const nodesData = hasHighlighted ? highlightedNodesData : selectedNodesData;
    if (nodesData.length > 0) {
      this.el.classList.remove('is-hidden');
    } else {
      this.el.classList.add('is-hidden');
    }

    this._update({
      isSelect: !hasHighlighted,
      nodesData,
      nodeHeights,
      columns,
      attributes,
      selectedResizeBy,
      selectedMapDimensions,
      recolorGroups,
      selectedYears,
      selectedContextId
    });
  }

  highlightNode({
    attributes,
    nodeHeights,
    selectedMapDimensions,
    highlightedNodesData,
    coordinates,
    selectedResizeBy
  }) {
    this.tooltip.hide();
    if (highlightedNodesData === undefined || !highlightedNodesData.length) {
      return;
    }
    // if we have coordinates, request came from hover on map, so we have a tooltip and don't need to show pill
    // else show pill for sankey node
    if (coordinates !== undefined) {
      this._showTooltip({
        nodeHeights,
        nodesData: highlightedNodesData,
        coordinates,
        attributes,
        selectedResizeBy,
        selectedMapDimensions
      });
    }
  }

  _update({
    isSelect,
    nodesData,
    columns,
    attributes,
    nodeHeights,
    selectedResizeBy,
    selectedMapDimensions,
    recolorGroups = null,
    selectedYears,
    selectedContextId
  }) {
    this.clear.classList.toggle('is-hidden', !isSelect);

    this.nodeTitleLinks = Array.prototype.slice.call(
      document.querySelectorAll('.js-node-title.-link'),
      0
    );

    this.nodeTitleLinks.forEach(nodeTitle => {
      nodeTitle.removeEventListener('click', this._onNodeTitleClickBound);
    });

    this.nodeTitleCloseButtons = Array.prototype.slice.call(
      document.querySelectorAll('.js-node-close'),
      0
    );

    this.nodeTitleCloseButtons.forEach(closeButton => {
      closeButton.removeEventListener('click', this._onNodeTitleCloseClickBound);
    });

    const templateData = {
      contextId: selectedContextId,
      year: selectedYears ? selectedYears[0] : null,
      nodes: nodesData.map(node => {
        const nodeHeight = nodeHeights && nodeHeights[node.id];
        const column = columns && columns[node.columnId];
        let renderedQuant;
        if (nodeHeight) {
          renderedQuant = {
            value: formatValue(nodeHeight.quant, selectedResizeBy.label),
            unit: selectedResizeBy.unit,
            name: selectedResizeBy.label
          };
        }

        let renderedMetas;
        if (attributes && selectedMapDimensions && selectedMapDimensions.length > 0) {
          renderedMetas = selectedMapDimensions
            .map(dimension => {
              const meta = getNodeMeta(dimension, node, attributes, selectedResizeBy, nodeHeights);
              if (!meta) {
                return null;
              }
              return {
                name: dimension.name,
                unit: dimension.unit,
                value: formatValue(meta.value, dimension.name)
              };
            })
            .filter(Boolean);
        }

        return Object.assign({}, node, {
          columnName: column?.name,
          hasLink:
            node.isUnknown !== true &&
            node.isDomesticConsumption !== true &&
            column?.profileType !== undefined &&
            column?.profileType !== null,
          selectedMetas: renderedMetas,
          renderedQuant
        });
      }),
      isSelect: isSelect || nodesData.length > 1,
      recolorGroups
    };

    this.container.innerHTML = NodeTitleTemplate(templateData);

    this.nodeTitleLinks = Array.prototype.slice.call(
      document.querySelectorAll('.js-node-title.-link'),
      0
    );

    this.nodeTitleLinks.forEach(nodeTitle => {
      nodeTitle.addEventListener('click', this._onNodeTitleClickBound);
    });

    this.nodeTitleCloseButtons = Array.prototype.slice.call(
      document.querySelectorAll('.js-node-close'),
      0
    );

    this.nodeTitleCloseButtons.forEach(closeButton => {
      closeButton.addEventListener('click', this._onNodeTitleCloseClickBound);
    });
  }

  _onNodeTitleClick(e) {
    this.callbacks.onProfileLinkClicked(
      parseInt(e.currentTarget.dataset.nodeId, 10),
      parseInt(e.currentTarget.dataset.contextId, 10)
    );
  }

  _onNodeTitleCloseClick(e) {
    e.stopPropagation();
    this.callbacks.onCloseNodeClicked(parseInt(e.currentTarget.dataset.nodeId, 10));
  }

  _showTooltip({
    nodeHeights,
    nodesData,
    coordinates,
    selectedMapDimensions,
    attributes,
    selectedResizeBy
  }) {
    const node = nodesData[0];
    const nodeHeight = nodeHeights && nodeHeights[node.id];

    if (!coordinates) {
      return;
    }

    let values = [];
    if (attributes && selectedMapDimensions && selectedMapDimensions.length > 0) {
      values = selectedMapDimensions
        .map(dimension => {
          const meta = getNodeMeta(dimension, node, attributes, selectedResizeBy, nodeHeights);
          if (!meta) {
            return null;
          }
          return {
            title: dimension.name,
            unit: dimension.unit,
            value: formatValue(meta.value, dimension.name)
          };
        })
        .filter(Boolean);
    }

    // if node is visible in sankey, quant is available
    if (nodeHeight) {
      values.push({
        title: selectedResizeBy.label,
        unit: selectedResizeBy.unit,
        value: formatValue(nodeHeight.quant, selectedResizeBy.label)
      });
    }
    this.tooltip.show(coordinates.pageX, coordinates.pageY, node.name, values);
  }
}
