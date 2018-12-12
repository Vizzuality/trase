/* eslint-disable jsx-a11y/no-static-element-interactions,jsx-a11y/no-noninteractive-element-interactions */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Tooltip from 'react-components/shared/help-tooltip/help-tooltip.component';
import FiltersDropdown from 'react-components/nav/filters-nav/filters-dropdown.component';
import RecolorByNodeLegendSummary from 'react-components/nav/filters-nav/recolor-by-selector/recolor-by-node-legend-summary/recolor-by-node-legend-summary.container';
import cx from 'classnames';
import isNumber from 'lodash/isNumber';
import difference from 'lodash/difference';
import sortBy from 'lodash/sortBy';

import 'styles/components/shared/dropdown-item-legend-summary.scss';

const id = 'recolor-by';

class RecolorBySelector extends Component {
  getRecolorByClassNames(item, recolorBy) {
    const recolorById = isNumber(item)
      ? item + parseInt(recolorBy.minValue, 10)
      : item.toLowerCase();

    const legendTypeName = recolorBy.legendType.toLowerCase();
    const legendColorThemeName = recolorBy.legendColorTheme.toLowerCase();
    return `-recolorby-${legendTypeName}-${legendColorThemeName}-${recolorById}`.replace(/ /g, '-');
  }

  getRecolorData() {
    const { recolorBys, selectedYears, tooltips } = this.props;
    const recolorByData = sortBy(recolorBys, ['groupNumber', 'position']).map(recolorBy => {
      const legendItems =
        recolorBy.nodes.length > 0 ? recolorBy.nodes : [...Array(recolorBy.intervalCount).keys()];
      const legendItemsData = legendItems.map(legendItem => {
        const recolorByClassNames = this.getRecolorByClassNames(legendItem, recolorBy);
        return {
          value: isNumber(legendItem) ? null : legendItem,
          cx: recolorByClassNames
        };
      });
      return { ...recolorBy, legendItemsData };
    });

    return [
      {
        label: 'Selection',
        name: 'none',
        description: tooltips.sankey.nav.colorBy.none || '',
        years: selectedYears
      }
    ].concat(recolorByData);
  }

  getRecolorByItem(recolorBy, index) {
    const { onSelected, selectedYears } = this.props;
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
  }

  getRecolorByElements() {
    const { currentDropdown } = this.props;
    if (currentDropdown !== 'recolor-by') {
      return null;
    }

    return this.getRecolorData().map((recolorBy, index, list) => {
      const hasSeparator = list[index - 1] && list[index - 1].groupNumber !== recolorBy.groupNumber;
      return (
        <React.Fragment key={recolorBy.name}>
          {hasSeparator && <li className="dropdown-item -separator" />}
          {this.getRecolorByItem(recolorBy, index)}
        </React.Fragment>
      );
    });
  }

  renderLegendSummary() {
    const { selectedRecolorBy } = this.props;
    let legendItems;
    if (selectedRecolorBy.nodes) {
      legendItems =
        selectedRecolorBy.nodes.length > 0
          ? selectedRecolorBy.nodes
          : [...Array(selectedRecolorBy.intervalCount).keys()];
      const currentLegendItemClasses = legendItems.map(item =>
        this.getRecolorByClassNames(item, selectedRecolorBy)
      );

      if (currentLegendItemClasses.length === 0) {
        return <RecolorByNodeLegendSummary />;
      }

      return (
        <div className="dropdown-item-legend-summary">
          {currentLegendItemClasses.map(legendItemClasses => (
            <div key={legendItemClasses} className={`color ${legendItemClasses}`} />
          ))}
        </div>
      );
    }
    return <RecolorByNodeLegendSummary />;
  }

  render() {
    const {
      className,
      tooltips,
      onToggle,
      currentDropdown,
      selectedRecolorBy,
      recolorBys
    } = this.props;

    const hasZeroOrSingleElement = recolorBys.length < 1;

    return (
      <div className={cx('js-dropdown', className)} onClick={() => onToggle(id)}>
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
            <ul className="dropdown-list -large">{this.getRecolorByElements()}</ul>
          </FiltersDropdown>
        </div>
        {this.renderLegendSummary()}
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
