import React from 'react';
import PropTypes from 'prop-types';
import BaseModal from 'react-components/tool/tool-modal/base-modal';
import SimpleModal from 'react-components/shared/simple-modal/simple-modal.component';
import 'react-components/tool/tool-modal/tool-modal.scss';

export default function ToolModal({ items, selectedItem, onChange, activeModal, setActiveModal }) {
  return activeModal ? (
    <SimpleModal
      isOpen
      onClickClose={() => setActiveModal(null)}
      onRequestClose={() => setActiveModal(null)}
    >
      <BaseModal
        items={items}
        selectedItem={selectedItem}
        onChange={onChange}
        itemId="attributeId"
        modalId={activeModal}
      />
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
