/* eslint-disable jsx-a11y/mouse-events-have-key-events, jsx-a11y/no-static-element-interactions, react/no-unused-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import YearsRange from 'react-components/shared/years-range/years-range.component';
import FiltersDropdown from 'react-components/nav/filters-nav/filters-dropdown.component';

import 'styles/components/tool/years-selector.scss';

function YearsSelector(props) {
  const { id, className, dropdownClassName, currentDropdown, selectedYears, onToggle } = props;
  const [selectedStart, selectedEnd] = selectedYears;
  const isOneYearSelected = selectedStart === selectedEnd;
  const title = isOneYearSelected ? (
    <span>{selectedStart}</span>
  ) : (
    <span>
      {selectedStart}&thinsp;-&thinsp;{selectedEnd}
    </span>
  );

  return (
    <div className={cx('js-dropdown', className)} onClick={() => onToggle(id)}>
      <div className={cx('c-dropdown', dropdownClassName)}>
        <span className="dropdown-label">year{!isOneYearSelected && <span>s</span>}</span>
        <span className="dropdown-title">{title}</span>
        <FiltersDropdown id={id} currentDropdown={currentDropdown} onClickOutside={onToggle}>
          <div className="dropdown-list" onClick={e => e.stopPropagation()}>
            <YearsRange {...props} />
          </div>
        </FiltersDropdown>
      </div>
    </div>
  );
}

YearsSelector.propTypes = {
  id: PropTypes.string,
  years: PropTypes.array,
  onToggle: PropTypes.func,
  onSelected: PropTypes.func,
  className: PropTypes.string,
  selectedYears: PropTypes.array,
  currentDropdown: PropTypes.string,
  dropdownClassName: PropTypes.string
};

export default YearsSelector;
