/* eslint-disable jsx-a11y/no-noninteractive-element-interactions,jsx-a11y/no-static-element-interactions */
import React from 'react';
import PropTypes from 'prop-types';
import Dropdown from 'react-components/shared/dropdown';
import Text from 'react-components/shared/text';

function ColumnSelector({
  hasSingleElement,
  columnItems,
  selectedColumnItem,
  handleColumnSelected
}) {
  return (
    <div className="c-dropdown">
      {hasSingleElement ? (
        <Text size="rg" align="center" variant="mono" weight="bold">
          {selectedColumnItem.name}
        </Text>
      ) : (
        <Dropdown
          options={columnItems.map(c => ({ label: c.name, value: c.id }))}
          value={{ value: selectedColumnItem.id, label: selectedColumnItem.name }}
          onChange={item => handleColumnSelected({ item })}
          variant="column"
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
