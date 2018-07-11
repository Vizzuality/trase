/* eslint-disable jsx-a11y/no-static-element-interactions,jsx-a11y/no-noninteractive-element-interactions */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Tooltip from 'react-components/shared/help-tooltip.component';
import FiltersDropdown from 'react-components/nav/filters-nav/filters-dropdown.component';
import RecolorByNodeLegendSummary from 'react-components/nav/filters-nav/recolor-by-selector/recolor-by-node-legend-summary/recolor-by-node-legend-summary.container';
import cx from 'classnames';
import isNumber from 'lodash/isNumber';
import difference from 'lodash/difference';

const id = 'recolor-by';

class RecolorBySelector extends Component {
  render() {
    const {
      className,
      tooltips,
      onToggle,
      onSelected,
      currentDropdown,
      selectedRecolorBy,
      recolorBys,
      selectedYears
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
        const recolorById = isNumber(legendItem)
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
          value: isNumber(legendItem) ? null : legendItem,
          cx: recolorByClassNames
        };
      });
      recolorBy.legendItemsData = legendItemsData;
      return recolorBy;
    });

    // Renders a dropdown item using recolorBy data
    const getRecolorByItem = (recolorBy, index) => {
      const isEnabled =
        !recolorBy.isDisabled &&
        (recolorBy.years.length === 0 || difference(selectedYears, recolorBy.years).length === 0);

      return (
        <li
          key={index}
          className={cx('dropdown-item', { '-disabled': !isEnabled })}
          onClick={() => isEnabled && onSelected(recolorBy)}
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
              <ul className={cx('dropdown-item-legend', `-${recolorBy.legendType}`)}>
                {recolorBy.legendItemsData.map((legendItem, key) => (
                  <li key={key} className={legendItem.cx}>
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
    };

    // Render all the dropdown items
    const recolorByElements = [];
    if (currentDropdown === 'recolor-by') {
      [
        {
          label: 'Selection',
          name: 'none',
          description: tooltips.sankey.nav.colorBy.none || '',
          years: selectedYears
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

    const hasZeroOrSingleElement = recolorBys.length < 1;

    return (
      <div
        className={cx('js-dropdown', className)}
        onClick={() => {
          onToggle(id);
        }}
      >
        <div
          className={cx('c-dropdown -small -capitalize', {
            '-hide-only-child': hasZeroOrSingleElement
          })}
        >
          <span className="dropdown-label">
            Recolour by
            <Tooltip text={tooltips.sankey.nav.colorBy.main} />
          </span>
          <span className="dropdown-title -small">{selectedRecolorBy.label || 'Selection'}</span>
          <FiltersDropdown id={id} currentDropdown={currentDropdown} onClickOutside={onToggle}>
            <ul className="dropdown-list -large">{recolorByElements}</ul>
          </FiltersDropdown>
        </div>
        {legendSummary}
      </div>
    );
  }
}

RecolorBySelector.propTypes = {
  className: PropTypes.string,
  tooltips: PropTypes.object,
  onToggle: PropTypes.func,
  onSelected: PropTypes.func,
  currentDropdown: PropTypes.string,
  selectedRecolorBy: PropTypes.object,
  recolorBys: PropTypes.array,
  selectedYears: PropTypes.array
};

export default RecolorBySelector;
