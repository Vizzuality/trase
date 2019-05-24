/* eslint-disable jsx-a11y/no-noninteractive-element-interactions,jsx-a11y/no-static-element-interactions */
import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import Dropdown from 'react-components/shared/dropdown';

function ColumnSelector({
  hasSingleElement,
  columnItems,
  selectedColumnItem,
  handleColumnSelected
}) {
  return (
    <div
      className={cx('js-dropdown c-dropdown -column-selector', {
        '-hide-only-child': hasSingleElement
      })}
    >
      {hasSingleElement ? (
        <span className="dropdown-title">{selectedColumnItem.name}</span>
      ) : (
        <Dropdown
          options={columnItems.map(c => ({ label: c.name, value: c.id }))}
          value={{ value: selectedColumnItem.id, label: selectedColumnItem.name }}
          onChange={item => handleColumnSelected({ item })}
          getCommodityClassName={() => 'dropdown-item'}
        />
      )}
    </div>
  );
}

ColumnSelector.propTypes = {
  hasSingleElement: PropTypes.bool,
  handleColumnSelected: PropTypes.func.isRequired,
  columnItems: PropTypes.array,
  selectedColumnItem: PropTypes.object
};

export default ColumnSelector;
