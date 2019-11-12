import React from 'react';
import PropTypes from 'prop-types';
import Text from 'react-components/shared/text';
import Heading from 'react-components/shared/heading';
import capitalize from 'lodash/capitalize';

import 'react-components/nav/filters-nav/tool-selection-modal-button/tool-selection-modal-button.scss';

export default function ToolSelectionModalButton(props) {
  const { selectedContext, setActiveModal, editPanels } = props;
  if (!selectedContext) {
    return null;
  }
  const selectedLabel = `${capitalize(selectedContext.countryName)} - ${capitalize(
    selectedContext.commodityName
  )}`;

  return (
    <button
      onClick={() => {
        editPanels();
        setActiveModal('context');
      }}
      className="c-tool-selection-modal-button"
    >
      <Text variant="mono" color="grey-faded" transform="uppercase" as="span" size="sm">
        Country - Commodity
      </Text>
      <Heading
        as="span"
        size="md"
        color="grey"
        weight="bold"
        className="selected-item"
        title={selectedLabel}
      >
        {selectedLabel}
      </Heading>
    </button>
  );
}

ToolSelectionModalButton.propTypes = {
  selectedContext: PropTypes.object,
  setActiveModal: PropTypes.func.isRequired,
  editPanels: PropTypes.func.isRequired
};
