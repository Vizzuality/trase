import React from 'react';
import Link from 'redux-first-router-link';
import { PropTypes } from 'prop-types';
import Button from 'react-components/shared/button';
import Text from 'react-components/shared/text';
import 'react-components/shared/cookie-banner/cookie-banner.scss';

function CookieBanner({ setAccepted, accepted }) {
  return accepted || !ENABLE_COOKIE_BANNER ? null : (
    <div className="c-cookie-banner">
      <div className="row">
        <div className="cookie-content">
          <div className="cookie-text">
            <Text as="span" color="white">
              This website uses cookies to provide you with an improved user experience. By
              continuing to browse this site, you consent to the use of cookies and similar
              technologies. Please visit our{' '}
            </Text>
            <Link to="/about/privacy-policy">
              <Text as="span" color="white" className="cookie-link">
                privacy policy
              </Text>
            </Link>{' '}
            <Text as="span" color="white">
              for further details.
            </Text>
          </div>
          <Button size="lg" weight="bold" color="gray-transparent" onClick={setAccepted}>
            I agree
          </Button>
        </div>
      </div>
    </div>
  );
}

CookieBanner.propTypes = {
  setAccepted: PropTypes.func.isRequired,
  accepted: PropTypes.bool
};

export default CookieBanner;
