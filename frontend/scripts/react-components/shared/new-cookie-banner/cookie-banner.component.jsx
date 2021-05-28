import React from 'react';
import Link from 'redux-first-router-link';
import { PropTypes } from 'prop-types';
import NewButton from 'react-components/shared/new-button';
import Text from 'react-components/shared/text';
import 'react-components/shared/new-cookie-banner/cookie-banner.scss';

function CookieBanner({ setAccepted, accepted }) {
  return accepted ? null : (
    <div className="c-new-cookie-banner">
      <div className="row">
        <div className="cookie-content">
          <div className="cookie-text">
            <Text as="span" color="grey" variant="sans" weight="bold" lineHeight="md">
              This website uses cookies to provide you with an improved user experience. By
              continuing to browse this site, you consent to the use of cookies and similar
              technologies. Please visit our{' '}
            </Text>
            <Link to="/about/privacy-policy">
              <Text as="span" color="pink" className="cookie-link" variant="sans" weight="bold">
                privacy policy
              </Text>
            </Link>{' '}
            <Text as="span" color="grey" variant="sans" weight="bold" lineHeight="md">
              for further details.
            </Text>
          </div>
          <NewButton size="xs" weight="bold" color="pink" onClick={setAccepted}>
            I understand
          </NewButton>
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
