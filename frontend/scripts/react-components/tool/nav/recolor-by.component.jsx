/* eslint-disable jsx-a11y/no-static-element-interactions,jsx-a11y/no-noninteractive-element-interactions */
import React, { Component } from 'react';
import classNames from 'classnames';
import _ from 'lodash';
import Tooltip from 'react-components/tool/help-tooltip.component';
import Dropdown from 'react-components/tool/nav/dropdown.component';
import RecolorByNodeLegendSummary from 'containers/tool/nav/recolor-by-node-legend-summary.container';
import PropTypes from 'prop-types';

const id = 'recolor-by';

class RecolorBy extends Component {
  render() {
    const {
      tooltips,
      onToggle,
      onSelected,
      currentDropdown,
      selectedRecolorBy,
      recolorBys
    } = this.props;

    recolorBys.sort(
      (a, b) =>
        a.groupNumber === b.groupNumber ? a.position > b.position : a.groupNumber > b.groupNumber
    );

    // Collect the legend items classes (ie colors) for the currently selected recolorBy.
    // It will be used to style the legend summary (colored bar at the bottom of the dropdown)
    const currentLegendItemsClasses = [];

    // Prepare legend item class names and values
    const recolorBysData = recolorBys.map(recolorBy => {
      const legendItems =
        recolorBy.nodes.length > 0 ? recolorBy.nodes : [...Array(recolorBy.intervalCount).keys()];
      const legendItemsData = legendItems.map(legendItem => {
        const recolorById = _.isNumber(legendItem)
          ? legendItem + parseInt(recolorBy.minValue, 10)
          : legendItem.toLowerCase();

        const legendTypeName = recolorBy.legendType.toLowerCase();
        const legendColorThemeName = recolorBy.legendColorTheme.toLowerCase();
        const recolorByClassNames = `-recolorby-${legendTypeName}-${legendColorThemeName}-${recolorById}`.replace(
          / /g,
          '-'
        );
        if (recolorBy.name === selectedRecolorBy.name) {
          currentLegendItemsClasses.push(recolorByClassNames);
        }
        return {
          value: _.isNumber(legendItem) ? null : legendItem,
          classNames: recolorByClassNames
        };
      });
      recolorBy.legendItemsData = legendItemsData;
      return recolorBy;
    });

    // Renders a dropdown item using recolorBy data
    const getRecolorByItem = (recolorBy, index) => (
      <li
        key={index}
        className={classNames('dropdown-item', { '-disabled': recolorBy.isDisabled })}
        onClick={() => onSelected(recolorBy)}
      >
        <div className="dropdown-item-title">
          {recolorBy.label}
          {recolorBy.description && <Tooltip constraint="window" text={recolorBy.description} />}
        </div>
        <div className="dropdown-item-legend-container">
          {recolorBy.minValue && (
            <span className="dropdown-item-legend-unit -left">{recolorBy.minValue}</span>
          )}
          {recolorBy.legendType && (
            <ul className={classNames('dropdown-item-legend', `-${recolorBy.legendType}`)}>
              {recolorBy.legendItemsData.map((legendItem, key) => (
                <li key={key} className={legendItem.classNames}>
                  {legendItem.value}
                </li>
              ))}
            </ul>
          )}
          {recolorBy.maxValue && (
            <span className="dropdown-item-legend-unit -right">{recolorBy.maxValue}</span>
          )}
        </div>
      </li>
    );

    // Render all the dropdown items
    const recolorByElements = [];
    if (currentDropdown === 'recolor-by') {
      [
        {
          label: 'Node selection',
          name: 'none',
          description: tooltips.sankey.nav.colorBy.none || ''
        }
      ]
        .concat(recolorBysData)
        .forEach((recolorBy, index, currentRecolorBys) => {
          if (index > 0 && currentRecolorBys[index - 1].groupNumber !== recolorBy.groupNumber) {
            recolorByElements.push(
              <li key={`separator-${index}`} className="dropdown-item -separator" />
            );
          }
          recolorByElements.push(getRecolorByItem(recolorBy, index));
        });
    }

    // Render legend summary (colored bar at the bottom of the dropdown)
    let legendSummary;
    if (currentLegendItemsClasses.length) {
      legendSummary = (
        <div className="dropdown-item-legend-summary">
          {currentLegendItemsClasses.map((legendItemClasses, key) => (
            <div key={key} className={`color ${legendItemClasses}`} />
          ))}
        </div>
      );
    } else {
      legendSummary = <RecolorByNodeLegendSummary />;
    }

    const hasZeroOrSingleElement = recolorBys.length <= 1;

    return (
      <div
        className="nav-item js-dropdown"
        onClick={() => {
          onToggle(id);
        }}
      >
        <div
          className={classNames('c-dropdown -small -capitalize', {
            '-hide-only-child': hasZeroOrSingleElement
          })}
        >
          <span className="dropdown-label">
            Recolour by
            <Tooltip text={tooltips.sankey.nav.colorBy.main} />
          </span>
          <span className="dropdown-title -small">{selectedRecolorBy.label || 'Selection'}</span>
          {selectedRecolorBy.name &&
            tooltips.sankey.nav.colorBy[selectedRecolorBy.name] && (
              <Tooltip
                className="recolor-by"
                text={tooltips.sankey.nav.colorBy[selectedRecolorBy.name]}
              />
            )}
          <Dropdown id={id} currentDropdown={currentDropdown} onClickOutside={onToggle}>
            <ul className="dropdown-list -large">{recolorByElements}</ul>
          </Dropdown>
        </div>
        {legendSummary}
      </div>
    );
  }
}

RecolorBy.propTypes = {
  tooltips: PropTypes.object,
  onToggle: PropTypes.func,
  onSelected: PropTypes.func,
  currentDropdown: PropTypes.string,
  selectedRecolorBy: PropTypes.object,
  recolorBys: PropTypes.array
};

export default RecolorBy;
