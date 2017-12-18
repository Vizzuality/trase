import formatValue from 'utils/formatValue';
import NodeTitleTemplate from 'templates/tool/nodeTitle.ejs';
import 'styles/components/tool/nodesTitles.scss';
import 'styles/components/tool/nodes-clear.scss';
import Tooltip from 'components/shared/info-tooltip.component';

export default class {
  onCreated() {
    this.el = document.querySelector('.js-nodes-titles');
    this.container = this.el.querySelector('.js-nodes-titles-container');
    this.clear = this.el.querySelector('.js-nodes-titles-clear');
    this.tooltip = new Tooltip('.js-node-tooltip');

    this._onNodeTitleClickBound = this._onNodeTitleClick.bind(this);
    this._onNodeTitleCloseClickBound = this._onNodeTitleCloseClick.bind(this);

    this.clear.addEventListener('click', this.callbacks.onClearClick);
  }

  selectNodes(data) {
    this._update(true, data.nodesData, data.recolorGroups, data.currentQuant, data.selectedYears);
  }

  highlightNode({ isHighlight, nodesData, recolorGroups, coordinates, isMapVisible, currentQuant, selectedYears }) {
    this.tooltip.hide();
    if (nodesData === undefined || !nodesData.length) {
      return;
    }
    // when map is full screen, show data as a tooltip instead of a nodeTitle
    if (coordinates !== undefined) {
      this._showTooltip(nodesData, coordinates, currentQuant);
    }

    // TODO nodesData[0] === undefined should never happen, this is a smell from the reducer
    if (nodesData === undefined || nodesData.length === 0 || nodesData[0] === undefined) {
      this.el.classList.add('is-hidden');
    } else {
      if (isMapVisible === false) {
        this.el.classList.remove('is-hidden');
        this._update(!isHighlight, nodesData, recolorGroups, currentQuant, selectedYears);
      }
    }
  }

  _update(isSelect, nodesData, recolorGroups = null, currentQuant, selectedYears) {
    this.clear.classList.toggle('is-hidden', !isSelect);

    Array.prototype.slice.call(document.querySelectorAll('.js-node-title.-link'), 0).forEach((nodeTitle) => {
      nodeTitle.removeEventListener('click', this._onNodeTitleClick);
    });

    Array.prototype.slice.call(document.querySelectorAll('.js-node-close'), 0).forEach((closeButton) => {
      closeButton.removeEventListener('click', this._onNodeTitleCloseClick);
    });

    const templateData = {
      year: selectedYears ? selectedYears[0] : null,
      nodes: nodesData.map(node => {
        let renderedQuant;
        if (node.quant !== undefined) {
          renderedQuant = {
            valueNice: formatValue(node.quant, currentQuant.name),
            unit: currentQuant.unit,
            name: currentQuant.name,
          };
        }

        let renderedMetas;
        if (node.selectedMetas !== undefined) {
          renderedMetas = node.selectedMetas.map(originalMeta => ({
            valueNice: formatValue(originalMeta.rawValue, originalMeta.name),
            name: originalMeta.name,
            unit: originalMeta.unit,
          }));
        }

        const renderedNode = Object.assign({}, node, {
          hasLink: node.isUnknown !== true && node.isDomesticConsumption !== true && node.profileType !== undefined && node.profileType !== null,
          selectedMetas: renderedMetas,
          renderedQuant
        });

        return renderedNode;
      }),
      isSelect: isSelect || nodesData.length > 1,
      recolorGroups
    };

    this.container.innerHTML = NodeTitleTemplate(templateData);

    Array.prototype.slice.call(document.querySelectorAll('.js-node-title.-link'), 0).forEach((nodeTitle) => {
      nodeTitle.addEventListener('click', this._onNodeTitleClickBound);
    });

    Array.prototype.slice.call(document.querySelectorAll('.js-node-close'), 0).forEach((closeButton) => {
      closeButton.addEventListener('click', this._onNodeTitleCloseClickBound);
    });
  }

  _onNodeTitleClick(e) {
    this.callbacks.onProfileLinkClicked(parseInt(e.currentTarget.dataset.nodeId), parseInt(e.currentTarget.dataset.year));
  }

  _onNodeTitleCloseClick(e) {
    e.stopPropagation();
    this.callbacks.onCloseNodeClicked(parseInt(e.currentTarget.dataset.nodeId));
  }

  _showTooltip(nodesData, coordinates, currentQuant) {
    const node = nodesData[0];

    if (node.selectedMetas === undefined) {
      return;
    }

    let values = [];

    // map metas might not be loaded yet
    if (node.selectedMetas !== undefined) {
      values = node.selectedMetas.map(meta => {
        return {
          title: meta.name,
          unit: meta.unit,
          value: formatValue(meta.rawValue, meta.name)
        };
      }).concat(values);
    }

    // if node is visible in sankey, quant is available
    if (node.quant !== undefined) {
      values.push({
        title: currentQuant.name,
        unit: currentQuant.unit,
        value: formatValue(node.quant, currentQuant.name)
      });
    }

    this.tooltip.show(coordinates.pageX, coordinates.pageY, node.name, values);
  }
}
