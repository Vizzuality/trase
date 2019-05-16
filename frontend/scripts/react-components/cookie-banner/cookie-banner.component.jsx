import React, { useState } from 'react';
import Link from 'redux-first-router-link';
import { PropTypes } from 'prop-types';
import Button from 'react-components/shared/button';
import Text from 'react-components/shared/text';
import 'react-components/cookie-banner/cookie-banner.scss';
import cx from 'classnames';

function CookieBanner({ setAccepted }) {
  const [accepted, closeBanner] = useState(false);
  alert(accepted);
  return (
    <div className={cx('c-cookie-banner', { removed: accepted })}>
      <div className="row">
        <div className="cookie-content">
          <div className="cookie-text">
            <Text as="span" color="white">
              This website uses cookies to provide you with an improved user experience. By
              continuing to browse this site, you consent to the use of cookies and similar
              technologies. Please visit our{' '}
            </Text>
            <Link to="/privacy-policy">
              <Text as="span" color="white" className="cookie-link">
                privacy policy
              </Text>
            </Link>{' '}
            <Text as="span" color="white">
              for further details.
            </Text>
          </div>
          <Button
            size="lg"
            weight="bold"
            color="white"
            onClick={() => {
              closeBanner(true);
              setAccepted();
            }}
          >
            Ok
          </Button>
        </div>
      </div>
    </div>
  );
}

CookieBanner.propTypes = {
  setAccepted: PropTypes.func.isRequired
};

export default CookieBanner;
