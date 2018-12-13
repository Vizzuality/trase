/* eslint-disable jsx-a11y/no-static-element-interactions,jsx-a11y/no-noninteractive-element-interactions */
import React, { Component } from 'react';
import cx from 'classnames';
import Tooltip from 'react-components/shared/help-tooltip/help-tooltip.component';
import FiltersDropdown from 'react-components/nav/filters-nav/filters-dropdown.component';
import PropTypes from 'prop-types';
import difference from 'lodash/difference';
import sortBy from 'lodash/sortBy';

const id = 'resize-by';

class ResizeBySelector extends Component {
  renderResizeByElements() {
    const { onSelected, currentDropdown, resizeBys, selectedYears } = this.props;

    if (currentDropdown !== 'resize-by') return [];
    return sortBy(resizeBys, ['groupNumber', 'position']).map((resizeBy, index, list) => {
      const isEnabled =
        !resizeBy.isDisabled &&
        (resizeBy.years.length === 0 || difference(selectedYears, resizeBy.years).length === 0);

      const hasSeparator = list[index - 1] && list[index - 1].groupNumber !== resizeBy.groupNumber;

      return (
        <React.Fragment key={resizeBy.label}>
          {hasSeparator && <li className="dropdown-item -separator" />}
          <li
            className={cx('dropdown-item', { '-faded': !isEnabled })}
            onClick={() => isEnabled && onSelected(resizeBy)}
          >
            {resizeBy.label.toLowerCase()}
            {resizeBy.description && <Tooltip constraint="window" text={resizeBy.description} />}
          </li>
        </React.Fragment>
      );
    });
  }

  render() {
    const {
      className,
      tooltips,
      onToggle,
      currentDropdown,
      selectedResizeBy,
      resizeBys
    } = this.props;

    const hasZeroOrSingleElement = resizeBys.length <= 1;

    return (
      <div className={cx('js-dropdown', className)} onClick={() => onToggle(id)}>
        <div
          className={cx('c-dropdown -small -capitalize', {
            '-hide-only-child': hasZeroOrSingleElement
          })}
        >
          <span className="dropdown-label">
            Resize by
            <Tooltip constraint="window" text={tooltips.sankey.nav.resizeBy.main} />
          </span>
          <span className="dropdown-title -small">{selectedResizeBy.label.toLowerCase()}</span>
          {selectedResizeBy.name && tooltips.sankey.nav.resizeBy[selectedResizeBy.name] && (
            <Tooltip
              constraint="window"
              floating
              text={tooltips.sankey.nav.resizeBy[selectedResizeBy.name]}
            />
          )}
          <FiltersDropdown id={id} currentDropdown={currentDropdown} onClickOutside={onToggle}>
            <ul className="dropdown-list -medium">{this.renderResizeByElements()}</ul>
          </FiltersDropdown>
        </div>
      </div>
    );
  }
}

ResizeBySelector.propTypes = {
  className: PropTypes.string,
  onToggle: PropTypes.func,
  onSelected: PropTypes.func,
  currentDropdown: PropTypes.string,
  selectedResizeBy: PropTypes.object,
  resizeBys: PropTypes.array,
  tooltips: PropTypes.object,
  selectedYears: PropTypes.array
};

export default ResizeBySelector;
