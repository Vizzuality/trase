import { h } from 'preact';
import classNames from 'classnames';
import _ from 'lodash';
import Tooltip from 'react-components/tool/help-tooltip.component';
import Dropdown from 'react-components/tool/nav/dropdown.component';
import RecolorByNodeLegendSummary from 'containers/tool/nav/recolor-by-node-legend-summary.container';

const id = 'recolor-by';

export default ({ tooltips, onToggle, onSelected, currentDropdown, selectedRecolorBy, recolorBys }) => {
  recolorBys.sort((a, b) => (a.groupNumber === b.groupNumber) ? (a.position > b.position) : (a.groupNumber > b.groupNumber));

  // Collect the legend items classes (ie colors) for the currently selected recolorBy.
  // It will be used to style the legend summary (colored bar at the bottom of the dropdown)
  const currentLegendItemsClasses = [];

  // Prepare legend item class names and values
  const recolorBysData = recolorBys.map(recolorBy => {
    const legendItems = (recolorBy.nodes.length > 0) ? recolorBy.nodes : [...Array(recolorBy.intervalCount).keys()];
    const legendItemsData = legendItems.map(legendItem => {
      const id = (_.isNumber(legendItem)) ? legendItem + parseInt(recolorBy.minValue) : legendItem.toLowerCase();
      const classNames = `-recolorby-${recolorBy.legendType.toLowerCase()}-${recolorBy.legendColorTheme.toLowerCase()}-${id}`.replace(/ /g, '-');
      if (recolorBy.name === selectedRecolorBy.name) {
        currentLegendItemsClasses.push(classNames);
      }
      return {
        value: _.isNumber(legendItem) ? null : legendItem,
        classNames
      };
    });
    recolorBy.legendItemsData = legendItemsData;
    return recolorBy;
  });

  // Renders a dropdown item using recolorBy data
  const getRecolorByItem = (recolorBy) => {
    return <li
      class={classNames('dropdown-item', { '-disabled': recolorBy.isDisabled })}
      onClick={() => onSelected(recolorBy)}
    >
      <div class='dropdown-item-title'>
        {recolorBy.label}
        {recolorBy.description &&
          <Tooltip position='bottom right' text={recolorBy.description} />
        }
      </div>
      <div class='dropdown-item-legend-container'>
        {recolorBy.minValue &&
          <span class='dropdown-item-legend-unit -left'>{recolorBy.minValue}</span>
        }
        {recolorBy.legendType &&
          <ul class={classNames('dropdown-item-legend', `-${recolorBy.legendType}`)}>
            {recolorBy.legendItemsData.map(legendItem => <li class={legendItem.classNames}>{legendItem.value}</li>)}
          </ul>
        }
        {recolorBy.maxValue &&
          <span class='dropdown-item-legend-unit -right'>{recolorBy.maxValue}</span>
        }
      </div>
    </li>;
  };

  // Render all the dropdown items
  const recolorByElements = [];
  if (currentDropdown === 'recolor-by') {
    [{ label: 'Node selection', name: 'none', description: tooltips.sankey.nav.colorBy['none'] || '' }]
      .concat(recolorBysData)
      .forEach((recolorBy, index, currentRecolorBys) => {
        if (index > 0 && currentRecolorBys[index - 1].groupNumber !== recolorBy.groupNumber) {
          recolorByElements.push(<li class='dropdown-item -separator' />);
        }
        recolorByElements.push(getRecolorByItem(recolorBy));
      });
  }

  // Render legend summary (colored bar at the bottom of the dropdown)
  let legendSummary;
  if (currentLegendItemsClasses.length) {
    legendSummary = <div class='dropdown-item-legend-summary'>
      {currentLegendItemsClasses.map(legendItemClasses => <div class={`color ${legendItemClasses}`} />)}
    </div>;
  } else {
    legendSummary = <RecolorByNodeLegendSummary />;
  }

  const hasZeroOrSingleElement = recolorBys.length <= 1;

  return (
    <div class='nav-item js-dropdown' onClick={() => { onToggle(id); }}>
      <div class={classNames('c-dropdown -small -capitalize', { ['-hide-only-child']: hasZeroOrSingleElement } )}>
        <span class='dropdown-label'>
          Recolour by
          <Tooltip position='top right' text={tooltips.sankey.nav.colorBy.main} />
        </span>
        <span class='dropdown-title -small'>
          {selectedRecolorBy.label || 'Node selection'}
        </span>
        {selectedRecolorBy.name && tooltips.sankey.nav.colorBy[selectedRecolorBy.name] &&
          <Tooltip position='bottom right' floating text={tooltips.sankey.nav.colorBy[selectedRecolorBy.name]} />
        }
        <Dropdown id={id} currentDropdown={currentDropdown} onClickOutside={onToggle}>
          <ul class='dropdown-list -large'>
            {recolorByElements}
          </ul>
        </Dropdown>
      </div>
      {legendSummary}
    </div>
  );
};
