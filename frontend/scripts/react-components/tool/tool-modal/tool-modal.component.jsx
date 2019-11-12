import React from 'react';
import PropTypes from 'prop-types';
import BaseModal from 'react-components/tool/tool-modal/base-modal';
import ToolSelectionModal from 'react-components/tool/tool-modal/tool-selection-modal';
import LayerModal from 'react-components/tool/tool-modal/layer-modal';
import VersioningModal from 'react-components/tool/tool-modal/versioning-modal';
import SimpleModal from 'react-components/shared/simple-modal/simple-modal.component';
import 'react-components/tool/tool-modal/tool-modal.scss';

export default function ToolModal({
  items,
  selectedItem,
  onChange,
  activeModal,
  setActiveModal,
  cancelPanelsDraft
}) {
  const SimpleModalComponent = ({ children }) => (
    <SimpleModal isOpen onRequestClose={() => setActiveModal(null)}>
      {children}
    </SimpleModal>
  );

  SimpleModalComponent.propTypes = {
    children: PropTypes.node.isRequired
  };

  const getModalComponent = () => {
    switch (activeModal) {
      case 'context':
        return (
          <SimpleModal
            isOpen
            onRequestClose={() => {
              setActiveModal(null);
              cancelPanelsDraft();
            }}
          >
            <ToolSelectionModal />;
          </SimpleModal>
        );
      case 'layer':
        return (
          <SimpleModalComponent>
            <LayerModal />
          </SimpleModalComponent>
        );
      case 'version':
        return (
          <SimpleModalComponent>
            <VersioningModal />
          </SimpleModalComponent>
        );
      default:
        return (
          <SimpleModalComponent>
            <BaseModal
              items={items}
              selectedItem={selectedItem}
              onChange={onChange}
              modalId={activeModal}
            />
          </SimpleModalComponent>
        );
    }
  };
  return activeModal ? getModalComponent() : null;
}

ToolModal.propTypes = {
  items: PropTypes.array,
  selectedItem: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  activeModal: PropTypes.string,
  setActiveModal: PropTypes.func.isRequired
};
