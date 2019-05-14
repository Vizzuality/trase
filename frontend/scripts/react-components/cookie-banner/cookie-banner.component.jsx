import React from 'react';
import Link from 'redux-first-router-link';
import { PropTypes } from 'prop-types';

function CookieBanner({ setAccepted }) {
  return (
    <div className="c-cookie-banner">
      This website uses cookies to provide you with an improved user experience. By continuing to
      browse this site, you consent to the use of cookies and similar technologies. Please visit
      our{' '}
      <Link to="/privacy-policy" onClick={setAccepted}>
        privacy policy
      </Link>{' '}
      for further details.
    </div>
  );
}

CookieBanner.propTypes = {
  setAccepted: PropTypes.func.isRequired
};

export default CookieBanner;