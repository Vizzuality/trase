import React from 'react';
import PropTypes from 'prop-types';
import GridList from 'react-components/shared/grid-list/grid-list.component';
import GridListItem from 'react-components/shared/grid-list-item/grid-list-item.component';
import { LAYER_TAB_NAMES } from 'constants';

export default function LayersList(props) {
  const { items, currentSelection, selectedTab, changeSelection } = props;
  const COLUMN_COUNT = 3;
  const selectedItemIds = currentSelection[selectedTab];
  const idAttribute = {
    [LAYER_TAB_NAMES.unit]: 'uid',
    [LAYER_TAB_NAMES.contextual]: 'id'
  }[selectedTab];
  const enableItem = item =>
    changeSelection({
      ...currentSelection,
      [selectedTab]: [...(selectedItemIds || []), item[idAttribute]]
    });
  const disableItem = item =>
    changeSelection({
      ...currentSelection,
      [selectedTab]: selectedItemIds.filter(id => id !== item[idAttribute])
    });
  const isActive = itemProps =>
    selectedTab === LAYER_TAB_NAMES.unit
      ? itemProps.item && !itemProps.item.isGroup && selectedItemIds?.includes(itemProps.item.uid)
      : selectedItemIds?.includes(itemProps.item.id);
  const height = window.innerHeight * 0.9 - 155;
  return (
    <GridList
      items={items}
      height={height}
      width={750}
      rowHeight={50}
      columnWidth={240}
      columnCount={COLUMN_COUNT}
      outerElementType={p => <div {...p} className="layers-grid-list-container" />}
      groupBy={selectedTab === LAYER_TAB_NAMES.unit ? 'group' : undefined}
    >
      {itemProps => (
        <GridListItem
          {...itemProps}
          tooltip={itemProps.item?.description}
          isActive={isActive(itemProps)}
          enableItem={enableItem}
          disableItem={disableItem}
          isDisabled={
            selectedTab === LAYER_TAB_NAMES.unit &&
            !isActive(itemProps) &&
            selectedItemIds?.length > 1
          }
        />
      )}
    </GridList>
  );
}

LayersList.propTypes = {
  items: PropTypes.array,
  currentSelection: PropTypes.object,
  selectedTab: PropTypes.string.isRequired,
  changeSelection: PropTypes.func.isRequired
};
