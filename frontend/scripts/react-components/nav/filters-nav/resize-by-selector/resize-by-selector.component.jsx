/* eslint-disable jsx-a11y/no-static-element-interactions,jsx-a11y/no-noninteractive-element-interactions */
import React, { Component } from 'react';
import cx from 'classnames';
import Tooltip from 'react-components/tool/help-tooltip.component';
import Dropdown from 'react-components/tool/nav/dropdown.component';
import PropTypes from 'prop-types';

const id = 'resize-by';

class ResizeBySelector extends Component {
  renderResizeByElements() {
    const { onSelected, currentDropdown, selectedResizeBy, resizeBys } = this.props;

    resizeBys.sort((a, b) => a.position > b.position);

    const resizeByElements = [];
    if (currentDropdown === 'resize-by') {
      resizeBys
        .filter(resizeBy => resizeBy.name !== selectedResizeBy.name)
        .forEach((resizeBy, index, currentResizeBys) => {
          if (index > 0 && currentResizeBys[index - 1].groupNumber !== resizeBy.groupNumber) {
            resizeByElements.push(
              <li key={`separator-${index}`} className="dropdown-item -separator" />
            );
          }
          resizeByElements.push(
            <li
              key={index}
              className={cx('dropdown-item', { '-disabled': resizeBy.isDisabled })}
              onClick={() => onSelected(resizeBy.name)}
            >
              {resizeBy.label.toLowerCase()}
              {resizeBy.description && <Tooltip constraint="window" text={resizeBy.description} />}
            </li>
          );
        });
    }

    return resizeByElements;
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

    resizeBys.sort((a, b) => a.position > b.position);

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
          {selectedResizeBy.name &&
            tooltips.sankey.nav.resizeBy[selectedResizeBy.name] && (
              <Tooltip
                constraint="window"
                floating
                text={tooltips.sankey.nav.resizeBy[selectedResizeBy.name]}
              />
            )}
          <Dropdown id={id} currentDropdown={currentDropdown} onClickOutside={onToggle}>
            <ul className="dropdown-list -medium">{this.renderResizeByElements()}</ul>
          </Dropdown>
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
  tooltips: PropTypes.object
};

export default ResizeBySelector;
