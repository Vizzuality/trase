import React from 'react';
import PropTypes from 'prop-types';
import Heading from 'react-components/shared/heading';
import capitalize from 'lodash/capitalize';

import 'react-components/nav/filters-nav/tool-selection-modal-button/tool-selection-modal-button.scss';

export default function ToolSelectionModalButton({ selectedContext, setActiveModal }) {
  const selectedLabel = selectedContext
    ? `${capitalize(selectedContext.countryName)} • ${capitalize(selectedContext.commodityName)}`
    : 'Select a context';

  return (
    <button onClick={() => setActiveModal('context')} className="c-tool-selection-modal-button">
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
  setActiveModal: PropTypes.func.isRequired
};
