/* eslint-disable jsx-a11y/no-noninteractive-element-interactions,jsx-a11y/no-static-element-interactions */
import React from 'react';
import PropTypes from 'prop-types';
import Dropdown from 'react-components/shared/dropdown';
import Text from 'react-components/shared/text';

import './column-selector.scss';

function ColumnSelector(props) {
  const {
    group,
    gapBetweenColumns,
    sankeyColumnsWidth,
    hasSingleElement,
    columnItems,
    selectedColumnItem,
    handleColumnSelected
  } = props;
  let content = (
    <Text className="column-selector" size="rg" align="center" variant="mono" weight="bold">
      {selectedColumnItem.name}
    </Text>
  );

  if (!hasSingleElement) {
    content = (
      <Dropdown
        className="column-selector"
        options={columnItems.map(c => ({ label: c.name, value: c.id }))}
        value={{ value: selectedColumnItem.id, label: selectedColumnItem.name }}
        onChange={item => handleColumnSelected({ item })}
        variant="column"
      />
    );
  }

  return (
    <div
      className="c-column-selector"
      style={{ left: group * sankeyColumnsWidth + group * gapBetweenColumns - 8 }}
    >
      {content}
    </div>
  );
}

ColumnSelector.propTypes = {
  group: PropTypes.number.isRequired,
  gapBetweenColumns: PropTypes.number.isRequired,
  sankeyColumnsWidth: PropTypes.number.isRequired,
  hasSingleElement: PropTypes.bool,
  handleColumnSelected: PropTypes.func.isRequired,
  columnItems: PropTypes.array,
  selectedColumnItem: PropTypes.object
};

export default ColumnSelector;
