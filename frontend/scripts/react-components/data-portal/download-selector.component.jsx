/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import includes from 'lodash/includes';
import FilterTooltip from 'react-components/data-portal/filter-tooltip/filter-tooltip.component';
import RadioButton from 'react-components/shared/radio-button/radio-button.component';

import 'react-components/profile/profile-components/chord/chord.scss';

class DownloadSelector extends Component {
  renderOptions() {
    const {
      onOptionFilterChange,
      onOptionFilterClear,
      onOptionSelected,
      options,
      selected,
      selectedFilters,
      title
    } = this.props;
    return options.map((elem, key) => (
      <li key={key}>
        <span>{title === 'COMPANIES' ? elem.name.toUpperCase() : elem.name}</span>
        {elem.filterOptions && (
          <FilterTooltip
            indicator={elem}
            selectedFilter={selectedFilters[elem.id]}
            onChange={onOptionFilterChange}
            onClear={onOptionFilterClear}
          />
        )}
        <RadioButton
          className="-red"
          noSelfCancel={elem.noSelfCancel}
          enabled={includes(selected, elem.id)}
          onClick={() => onOptionSelected(elem.id)}
        />
      </li>
    ));
  }

  render() {
    return (
      <div
        className={cx('c-custom-dataset-selector', { '-disabled': !this.props.enabled })}
        data-type="value"
      >
        <div className="c-custom-dataset-selector__header">
          {this.props.title}
          {this.props.allowMultiple && (
            <ul className="c-custom-dataset-selector__header-options">
              <li>
                <RadioButton
                  className="-red"
                  enabled={this.props.allSelected}
                  onClick={() => this.props.onAllSelected()}
                  disabled={!this.props.enabled}
                />
              </li>
            </ul>
          )}
        </div>
        <span className="c-custom-dataset-selector__disabled-text">{this.props.disabledText}</span>
        <ul className="c-custom-dataset-selector__values">{this.renderOptions()}</ul>
      </div>
    );
  }
}

DownloadSelector.defaultProps = {
  options: []
};

DownloadSelector.propTypes = {
  allSelected: PropTypes.bool,
  allowMultiple: PropTypes.bool,
  disabledText: PropTypes.string,
  enabled: PropTypes.bool,
  selected: PropTypes.array,
  options: PropTypes.array,
  selectedFilters: PropTypes.object,
  onOptionSelected: PropTypes.func.isRequired,
  onOptionFilterChange: PropTypes.func,
  onOptionFilterClear: PropTypes.func,
  onAllSelected: PropTypes.func,
  title: PropTypes.string
};

export default DownloadSelector;
