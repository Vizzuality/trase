import React from 'react';
import PropTypes from 'prop-types';
import Heading from 'react-components/shared/heading';
import Text from 'react-components/shared/text';
import Tooltip from 'react-components/shared/help-tooltip/help-tooltip.component';
import cx from 'classnames';

import 'react-components/nav/filters-nav/tool-modal-button/tool-modal-button.scss';

export default function ToolModalButton({
  selectedItem,
  modalId,
  tooltip,
  setActiveModal,
  hasMoreThanOneItem
}) {
  const selectedLabel = selectedItem?.label;
  return (
    <button
      disabled={!modalId === 'version' && !hasMoreThanOneItem}
      onClick={() => setActiveModal(modalId)}
      className="c-tool-modal-button"
    >
      <Text color="grey-faded" size="sm" variant="mono" transform="uppercase">
        {modalId}
        {tooltip && <Tooltip text={tooltip} constraint="window" />}
      </Text>
      <Heading
        as="span"
        size="rg"
        color="grey"
        weight="regular"
        className={cx('selected-item', {
          '-with-arrow': modalId === 'version' || hasMoreThanOneItem
        })}
        title={selectedLabel}
      >
        {selectedLabel}
      </Heading>
    </button>
  );
}

ToolModalButton.propTypes = {
  selectedItem: PropTypes.object,
  modalId: PropTypes.string.isRequired,
  setActiveModal: PropTypes.func.isRequired,
  tooltip: PropTypes.string,
  hasMoreThanOneItem: PropTypes.bool
};
