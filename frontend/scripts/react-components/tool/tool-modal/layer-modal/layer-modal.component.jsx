import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Heading from 'react-components/shared/heading';
import GridList from 'react-components/shared/grid-list/grid-list.component';
import GridListItem from 'react-components/shared/grid-list-item/grid-list-item.component';
import Text from 'react-components/shared/text';
import Tabs from 'react-components/shared/tabs/tabs.component';
import 'react-components/tool/tool-modal/layer-modal/layer-modal.scss';
import { LAYER_TAB_NAMES } from 'constants';

const renderList = (items, selectedItems, onChange) => {
  const COLUMN_COUNT = 3;
  return (
    <GridList
      items={items}
      height={items.length > COLUMN_COUNT ? (items.length / COLUMN_COUNT) * 60 : 60}
      width={750}
      rowHeight={50}
      columnWidth={240}
      columnCount={COLUMN_COUNT}
    >
      {itemProps => (
        <GridListItem
          {...itemProps}
          item={{ ...itemProps.item, name: itemProps.item.label }}
          tooltip={itemProps.item.description}
          isActive={selectedItems && selectedItems.map(i => i.id).includes(itemProps.item.id)}
          enableItem={onChange}
        />
      )}
    </GridList>
  );
};

export default function LayerModal({ layers, selectedItems, onChange }) {
  const tabs = [LAYER_TAB_NAMES.unit, LAYER_TAB_NAMES.contextual];
  const [selectedTab, changeTab] = useState(LAYER_TAB_NAMES.unit);
  const infoMessage = {
    'unit layers': 'You can choose one or two unit layers',
    'contextual layers': 'You can choose one or several contextual layers'
  }[selectedTab];
  return (
    <div className="c-layer-modal">
      <div className="row columns">
        <Heading size="md" className="modal-title">
          Edit map layers
        </Heading>
        <Tabs tabs={tabs} selectedTab={selectedTab} onSelectTab={tab => changeTab(tab)} />
        <Text color="grey-faded" size="md">
          {infoMessage}
        </Text>
        {layers[selectedTab] &&
          renderList(layers[selectedTab], selectedItems[selectedTab], onChange)}
      </div>
    </div>
  );
}

LayerModal.propTypes = {
  layers: PropTypes.object,
  selectedItems: PropTypes.object,
  onChange: PropTypes.func.isRequired
};
