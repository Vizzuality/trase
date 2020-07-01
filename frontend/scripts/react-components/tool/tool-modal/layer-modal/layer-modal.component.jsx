import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import Heading from 'react-components/shared/heading';
import Text from 'react-components/shared/text';
import Button from 'react-components/shared/button';
import Tabs from 'react-components/shared/tabs/tabs.component';
import { LAYER_TAB_NAMES } from 'constants';
import 'react-components/tool/tool-modal/layer-modal/layer-modal.scss';
import castArray from 'lodash/castArray';
import LayersList from 'react-components/tool/tool-modal/layer-modal/layers-list';

export default function LayerModal({
  layers,
  selectedItemIds,
  selectUnitLayers,
  selectContextualLayers,
  selectLogisticLayers,
  setActiveModal
}) {
  const tabs = useMemo(() => {
    const layerTabs = [];
    Object.keys(layers).forEach(key => {
      if (layers[key] && layers[key].length > 0) {
        layerTabs.push(key);
      }
    });
    return layerTabs;
  }, [layers]);

  const firstTab = useMemo(() => {
    let firstLayerTab = null;
    Object.keys(layers).some(key => {
      if (layers[key] && layers[key].length > 0) {
        firstLayerTab = key;
        return true;
      }
      return false;
    });
    return firstLayerTab;
  }, [layers]);

  const [selectedTab, changeTab] = useState(firstTab);
  const [currentSelection, changeSelection] = useState(selectedItemIds);
  const onSave = () => {
    const toArray = l => (l ? castArray(l) : null);
    const unitLayers =
      layers[LAYER_TAB_NAMES.unit].length > 0
        ? toArray(currentSelection[LAYER_TAB_NAMES.unit])
        : null;
    selectUnitLayers(unitLayers);
    selectContextualLayers(toArray(currentSelection[LAYER_TAB_NAMES.contextual]));
    selectLogisticLayers(toArray(currentSelection[LAYER_TAB_NAMES.logistic]));
    setActiveModal(null);
  };
  const infoMessage = {
    [LAYER_TAB_NAMES.unit]: 'Please choose up to two layers (one per indicator set)',
    [LAYER_TAB_NAMES.contextual]: 'Choose one or more contextual layers',
    [LAYER_TAB_NAMES.logistic]: 'You can choose one or several logistic hubs'
  }[selectedTab];
  return (
    <div className="c-layer-modal">
      <div className="row columns">
        <div className="layer-modal-content">
          <Heading size="md" className="modal-title">
            Edit layers to display in the map
          </Heading>
          <Tabs tabs={tabs} selectedTab={selectedTab} onSelectTab={tab => changeTab(tab)} />
          <Text color="grey-faded" size="md" className="info-message">
            {infoMessage}
          </Text>
          {layers[selectedTab] && (
            <LayersList
              items={layers[selectedTab]}
              currentSelection={currentSelection}
              selectedTab={selectedTab}
              changeSelection={changeSelection}
            />
          )}
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
  selectLogisticLayers: PropTypes.func.isRequired,
  setActiveModal: PropTypes.func.isRequired
};
