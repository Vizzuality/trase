import React from 'react';
import PropTypes from 'prop-types';
import Heading from 'react-components/shared/heading';
import capitalize from 'lodash/capitalize';

import 'react-components/nav/filters-nav/tool-modal-button/tool-modal-button.scss';

export default function ContextModalButton({ selectedContext, setActiveModal }) {
  const selectedLabel = selectedContext
    ? `${capitalize(selectedContext.countryName)} • ${capitalize(selectedContext.commodityName)}`
    : 'Select a context';

  return (
    <button onClick={() => setActiveModal('context')} className="c-context-modal-button">
      <Heading
        as="span"
        size="lg"
        color="grey-faded"
        weight="bold"
        className="selected-item"
        title={selectedLabel}
      >
        {selectedLabel}
      </Heading>
    </button>
  );
}

ContextModalButton.propTypes = {
  selectedContext: PropTypes.object,
  setActiveModal: PropTypes.func.isRequired
};
