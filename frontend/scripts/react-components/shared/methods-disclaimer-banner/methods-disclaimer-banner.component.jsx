import React from 'react';
import { PropTypes } from 'prop-types';
import Button from 'react-components/shared/button';
import Icon from 'react-components/shared/icon';
import Text from 'react-components/shared/text';
import 'react-components/shared/methods-disclaimer-banner/methods-disclaimer-banner.scss';

function MethodsDisclaimerBanner({ setAccepted, accepted }) {
  return accepted ? null : (
    <div className="c-methods-disclaimer">
      <div className="row disclaimer-content">
        <Text as="p" color="grey" variant="sans" lineHeight="md" align="center">
          Please note there are changes in methods before and after 2018 that are relevant for data
          interpretation.
        </Text>
        <Text as="p" color="grey" variant="sans" lineHeight="md" align="center">
          <a
            title="Brazil Soy method document"
            href="https://resources.trase.earth/documents/data_methods/SEI_PCS_Brazil_soy_2.6._EN.pdf"
            target="_blank"
            rel="noopener noreferrer"
            // eslint-disable-next-line react/no-unknown-property
            tx-content="translate_urls"
            className="link"
          >
            Check the method document
          </a>{' '}
          for more information.
        </Text>
      </div>
      <Button className="close-button" onClick={setAccepted}>
        CLOSE
        <Icon icon="icon-close" />
      </Button>
    </div>
  );
}

MethodsDisclaimerBanner.propTypes = {
  setAccepted: PropTypes.func.isRequired,
  accepted: PropTypes.bool
};

export default MethodsDisclaimerBanner;
