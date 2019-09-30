import React, { useState } from 'react';
import PropTypes from 'prop-types';
import BaseModal from 'react-components/tool/modals/base-modal';
import SimpleModal from 'react-components/shared/simple-modal/simple-modal.component';
import Heading from 'react-components/shared/heading';
import Text from 'react-components/shared/text';
import Tooltip from 'react-components/shared/help-tooltip/help-tooltip.component';
import 'react-components/tool/modals/tool-modal/tool-modal.scss';

export default function ToolModal({ items, selectedItem, onChange, modalId, tooltip }) {
  const [openModal, changeOpenModal] = useState(false);
  return (
    <div className="c-tool-modal">
      <button onClick={() => changeOpenModal(modalId)} className="tool-modal-button">
        <Text color="grey-faded" size="sm" variant="mono" transform="uppercase">
          {modalId}
          {tooltip && <Tooltip text={tooltip} constraint="window" />}
        </Text>
        <Heading as="span" size="rg" color="grey" weight="regular">
          {selectedItem.label}
        </Heading>
      </button>
      <SimpleModal isOpen={openModal === modalId} onClickClose={() => changeOpenModal(null)}>
        <BaseModal
          items={items}
          selectedItem={selectedItem}
          onChange={onChange}
          itemId="attributeId"
        />
      </SimpleModal>
    </div>
  );
}

ToolModal.propTypes = {
  items: PropTypes.array,
  selectedItem: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  modalId: PropTypes.string.isRequired,
  tooltip: PropTypes.string
};
