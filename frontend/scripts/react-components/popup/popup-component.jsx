import React from 'react';
import PropTypes from 'prop-types';
import Text from 'react-components/shared/text';
import Heading from 'react-components/shared/heading';
import Button from 'react-components/shared/button';
import SimpleModal from 'react-components/shared/simple-modal/simple-modal.component';

import './popup-styles.scss';
import 'styles/components/shared/veil.scss';
import 'styles/components/shared/modal.scss';

function PopUp({ handleOnRequestClose }) {
  return (
    <SimpleModal
      isOpen
      noClose
      onRequestClose={handleOnRequestClose}
      overlayClassName="popup-overlay"
    >
      <div className="c-popup">
        <div className="popup-content">
          <Heading as="h3" weight="bold" size="md">
            The term Deforestation Risk changes to Deforestation exposure
          </Heading>
          <Text as="p" size="md" lineHeight="md" className="description">
            On 10 November 2022, the term{' '}
            <Text as="span" weight="bold" size="md">
              ‘deforestation risk’
            </Text>{' '}
            was replaced with{' '}
            <Text as="span" weight="bold" size="md">
              ‘deforestation exposure’
            </Text>{' '}
            as a measure of the exposure of supply chain actors to deforestation from commodity
            production based on sourcing patterns.
          </Text>
          <Text as="p" size="md" lineHeight="md">
            For more information, see{' '}
            <a
              className="link"
              target="_blank"
              rel="noopener noreferrer"
              href="https://resources.trase.earth/documents/data_methods/Trase-deforestation-exposure.pdf"
            >
              Commodity deforestation exposure and carbon emissions assessment.
            </a>
          </Text>
          <Button size="md" color="pink" onClick={handleOnRequestClose} className="button">
            I understand
          </Button>
        </div>
      </div>
    </SimpleModal>
  );
}

PopUp.propTypes = {
  handleOnRequestClose: PropTypes.func.isRequired
};

export default PopUp;
