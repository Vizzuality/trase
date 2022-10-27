import React from 'react';
import { PropTypes } from 'prop-types';
import NewButton from 'react-components/shared/new-button';
import Text from 'react-components/shared/text';
import 'react-components/shared/cookie-banner/cookie-banner.scss';

function CookieBanner({ setAccepted, accepted }) {
  return accepted ? null : (
    <div className="c-cookie-banner">
      <div className="row">
        <div className="cookie-content">
          <div className="cookie-text">
            <Text as="span" color="grey" variant="sans" weight="bold" lineHeight="md">
              This website uses cookies to provide you with an improved user experience. By
              continuing to browse this site, you consent to the use of cookies and similar
              technologies. Please visit our{' '}
            </Text>
            <a
              href="https://www.trase.earth/privacy-policy"
              title="Privacy policy page"
              // eslint-disable-next-line react/jsx-no-target-blank
              target="_blank"
              rel="noopener noreferrer"
            >
              <Text as="span" color="pink" className="cookie-link" variant="sans" weight="bold">
                privacy policy
              </Text>
            </a>{' '}
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
