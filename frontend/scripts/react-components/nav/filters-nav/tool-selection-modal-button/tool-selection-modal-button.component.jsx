import React from 'react';
import PropTypes from 'prop-types';
import Heading from 'react-components/shared/heading';
import Text from 'react-components/shared/text/text.component';
import capitalize from 'lodash/capitalize';

import 'react-components/nav/filters-nav/tool-selection-modal-button/tool-selection-modal-button.scss';

export default function ToolSelectionModalButton(props) {
  const { selectedContext, setActiveModal } = props;
  const selectedLabel = selectedContext
    ? `${capitalize(selectedContext.countryName)} - ${capitalize(selectedContext.commodityName)}`
    : 'Select a context';

  return (
    <button onClick={() => setActiveModal('context')} className="c-tool-selection-modal-button">
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
  countryName: PropTypes.string,
  commodityName: PropTypes.string,
  setActiveModal: PropTypes.func.isRequired
};
