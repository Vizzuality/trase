import React from 'react';
import PropTypes from 'prop-types';
import BaseModal from 'react-components/tool/tool-modal/base-modal';
import LayerModal from 'react-components/tool/tool-modal/layer-modal';
import VersioningModal from 'react-components/tool/tool-modal/versioning-modal';
import SimpleModal from 'react-components/shared/simple-modal/simple-modal.component';
import 'react-components/tool/tool-modal/tool-modal.scss';

export default function ToolModal({ items, selectedItem, onChange, activeModal, setActiveModal }) {
  const getModalComponent = () => {
    switch (activeModal) {
      case 'layer':
        return <LayerModal />;
      case 'version':
        return <VersioningModal />;
      default:
        return (
          <BaseModal
            items={items}
            selectedItem={selectedItem}
            onChange={onChange}
            modalId={activeModal}
          />
        );
    }
  };
  return activeModal ? (
    <SimpleModal isOpen onRequestClose={() => setActiveModal(null)}>
      {getModalComponent()}
    </SimpleModal>
  ) : null;
}

ToolModal.propTypes = {
  items: PropTypes.array,
  selectedItem: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  activeModal: PropTypes.string,
  setActiveModal: PropTypes.func.isRequired
};
