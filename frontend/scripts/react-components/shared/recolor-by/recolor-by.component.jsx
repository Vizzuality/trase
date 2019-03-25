/* eslint-disable jsx-a11y/no-static-element-interactions,jsx-a11y/no-noninteractive-element-interactions */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Tooltip from 'react-components/shared/help-tooltip/help-tooltip.component';
import Dropdown, { Context as DropdownContext } from 'react-components/shared/dropdown';
import RecolorByNodeLegendSummary from 'react-components/shared/recolor-by/recolor-by-node-legend-summary';
import cx from 'classnames';
import capitalize from 'lodash/capitalize';
import isNumber from 'lodash/isNumber';
import difference from 'lodash/difference';
import sortBy from 'lodash/sortBy';

import './recolor-by.scss';

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
      return { ...recolorBy, legendItemsData, label: capitalize(recolorBy.label) };
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

  getRecolorByItem(recolorBy, index, contextProps) {
    const { selectedYears } = this.props;
    const { highlightedIndex, getItemProps } = contextProps;
    const isEnabled =
      !recolorBy.isDisabled &&
      (recolorBy.years.length === 0 || difference(selectedYears, recolorBy.years).length === 0);

    return (
      <li
        {...getItemProps({
          item: recolorBy,
          className: cx('recolor-by-item', {
            '-disabled': !isEnabled,
            '-highlighted': highlightedIndex === index
          }),
          disabled: !isEnabled
        })}
        key={recolorBy.label}
      >
        <div className="recolor-by-item-title">
          {recolorBy.label}
          {recolorBy.description && <Tooltip constraint="window" text={recolorBy.description} />}
        </div>
        <div className="recolor-by-item-legend-container">
          {recolorBy.minValue && (
            <span className="recolor-by-item-legend-unit -left">{recolorBy.minValue}</span>
          )}
          {recolorBy.legendType && (
            <ul className={cx('recolor-by-item-legend', `-${recolorBy.legendType}`)}>
              {recolorBy.legendItemsData.map((legendItem, key) => (
                <li key={key} className={legendItem.cx}>
                  {legendItem.value}
                </li>
              ))}
            </ul>
          )}
          {recolorBy.maxValue && (
            <span className="recolor-by-item-legend-unit -right">{recolorBy.maxValue}</span>
          )}
        </div>
      </li>
    );
  }

  getRecolorByElements(contextProps) {
    return this.getRecolorData().map((recolorBy, index, list) => {
      const hasSeparator = list[index - 1] && list[index - 1].groupNumber !== recolorBy.groupNumber;
      return (
        <React.Fragment key={recolorBy.name}>
          {hasSeparator && (
            <li className="recolor-by-item -separator" key={`${recolorBy.name}_separator`} />
          )}
          {this.getRecolorByItem(recolorBy, index, contextProps)}
        </React.Fragment>
      );
    });
  }

  renderLegendSummary() {
    const { selectedRecolorBy, recolorGroups } = this.props;
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
        return <RecolorByNodeLegendSummary recolorGroups={recolorGroups} />;
      }

      return (
        <div className="recolor-by-item-legend-summary">
          {currentLegendItemClasses.map(legendItemClasses => (
            <div key={legendItemClasses} className={`color ${legendItemClasses}`} />
          ))}
        </div>
      );
    }
    return <RecolorByNodeLegendSummary recolorGroups={recolorGroups} />;
  }

  render() {
    const { tooltips, onSelected, selectedRecolorBy, recolorBys } = this.props;
    const hasZeroOrSingleElement = recolorBys.length < 1;
    return (
      <Dropdown
        size="rg"
        showSelected
        variant="nav"
        weight="regular"
        label="Recolour By"
        onChange={onSelected}
        placement="bottom-start"
        value={selectedRecolorBy}
        selectedValueOverride={
          <>
            {selectedRecolorBy.label}
            {this.renderLegendSummary()}
          </>
        }
        isDisabled={hasZeroOrSingleElement}
        tooltip={tooltips.sankey.nav.colorBy.main}
      >
        <div className="c-recolor-by-selector">
          <DropdownContext.Consumer>
            {contextProps => this.getRecolorByElements(contextProps)}
          </DropdownContext.Consumer>
        </div>
      </Dropdown>
    );
  }
}

RecolorBySelector.propTypes = {
  tooltips: PropTypes.object,
  recolorGroups: PropTypes.array,
  onSelected: PropTypes.func.isRequired,
  selectedYears: PropTypes.array.isRequired,
  selectedRecolorBy: PropTypes.object.isRequired,
  recolorBys: PropTypes.array.isRequired
};

export default RecolorBySelector;
