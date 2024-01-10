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
            A new look is coming to Trase very soon.
          </Heading>
          <Text as="p" size="md" lineHeight="md" className="description">
            From 23 January, explore Trase’s trusted data through fresh and intuitive tools,
            supported by expert analysis.
          </Text>
          <Button size="md" color="pink" onClick={handleOnRequestClose} className="button">
            Ok
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
