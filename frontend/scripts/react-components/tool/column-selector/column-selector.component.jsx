/* eslint-disable jsx-a11y/no-noninteractive-element-interactions,jsx-a11y/no-static-element-interactions */
import React from 'react';
import PropTypes from 'prop-types';
import Dropdown from 'react-components/shared/dropdown';
import Text from 'react-components/shared/text';

import './column-selector.scss';

const SANKEY_LATERAL_MARGIN = 30;
const COLUMN_SELECTOR_CENTER_OFFSET = 8;

function ColumnSelector(props) {
  const {
    position,
    gapBetweenColumns,
    sankeyColumnsWidth,
    columnItems,
    selectedColumnItem,
    handleColumnSelected
  } = props;

  const hasMultipleElements = columnItems.length > 1;

  let content = (
    <Text className="column-selector" size="rg" align="center" variant="mono" weight="bold">
      {selectedColumnItem.name}
    </Text>
  );

  if (hasMultipleElements) {
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

  // TODO: Improve column selector position
  const columnPosition =
    selectedColumnItem.group === 3
      ? { right: '-3%' }
      : {
          left:
            position * sankeyColumnsWidth +
            position * gapBetweenColumns +
            SANKEY_LATERAL_MARGIN -
            COLUMN_SELECTOR_CENTER_OFFSET
        };
  return (
    <div className="c-column-selector" style={columnPosition}>
      {content}
    </div>
  );
}

ColumnSelector.propTypes = {
  position: PropTypes.number.isRequired,
  gapBetweenColumns: PropTypes.number.isRequired,
  sankeyColumnsWidth: PropTypes.number.isRequired,
  handleColumnSelected: PropTypes.func.isRequired,
  columnItems: PropTypes.array,
  selectedColumnItem: PropTypes.object
};

export default ColumnSelector;
