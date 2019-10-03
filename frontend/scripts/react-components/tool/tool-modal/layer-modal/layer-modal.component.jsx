import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Heading from 'react-components/shared/heading';
import GridList from 'react-components/shared/grid-list/grid-list.component';
import GridListItem from 'react-components/shared/grid-list-item/grid-list-item.component';
import Text from 'react-components/shared/text';
import Button from 'react-components/shared/button';
import Tabs from 'react-components/shared/tabs/tabs.component';
import { LAYER_TAB_NAMES } from 'constants';
import 'react-components/tool/tool-modal/layer-modal/layer-modal.scss';
import castArray from 'lodash/castArray';

const renderList = (items, currentSelection, selectedTab, changeSelection) => {
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

  return (
    <GridList
      items={items}
      height={items.length > COLUMN_COUNT ? (items.length / COLUMN_COUNT) * 60 : 60}
      width={750}
      rowHeight={50}
      columnWidth={240}
      columnCount={COLUMN_COUNT}
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
};

export default function LayerModal({
  layers,
  selectedItemIds,
  selectUnitLayers,
  selectContextualLayers,
  setActiveModal
}) {
  const tabs = [LAYER_TAB_NAMES.unit, LAYER_TAB_NAMES.contextual];
  const [selectedTab, changeTab] = useState(LAYER_TAB_NAMES.unit);
  const [currentSelection, changeSelection] = useState(selectedItemIds);
  const onSave = () => {
    const toArray = l => (l ? castArray(l) : null);
    selectUnitLayers(toArray(currentSelection[LAYER_TAB_NAMES.unit]));
    selectContextualLayers(toArray(currentSelection[LAYER_TAB_NAMES.contextual]));
    setActiveModal(null);
  };
  const infoMessage = {
    'unit layers': 'You can choose one or two unit layers',
    'contextual layers': 'You can choose one or several contextual layers'
  }[selectedTab];
  return (
    <div className="c-layer-modal">
      <div className="layer-modal-content">
        <div className="row columns">
          <Heading size="md" className="modal-title">
            Edit map layers
          </Heading>
          <Tabs tabs={tabs} selectedTab={selectedTab} onSelectTab={tab => changeTab(tab)} />
          <Text color="grey-faded" size="md" className="info-message">
            {infoMessage}
          </Text>
          {layers[selectedTab] &&
            renderList(layers[selectedTab], currentSelection, selectedTab, changeSelection)}
        </div>
      </div>
      <div className="modal-footer">
        <Button size="md" color="pink" onClick={onSave} className="save-button">
          Save
        </Button>
      </div>
    </div>
  );
}

LayerModal.propTypes = {
  layers: PropTypes.object,
  selectedItemIds: PropTypes.object,
  selectUnitLayers: PropTypes.func.isRequired,
  selectContextualLayers: PropTypes.func.isRequired,
  setActiveModal: PropTypes.func.isRequired
};
