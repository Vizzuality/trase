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
            title="Spatially Explicit Information on Production to Consumption Systems by Godar et al.2015"
            href="https://www.sciencedirect.com/science/article/abs/pii/S0921800915000427?via%3Dihub"
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
