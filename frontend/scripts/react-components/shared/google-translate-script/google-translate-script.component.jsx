import React from 'react';
import Helmet from 'react-helmet';

function readCookie(name) {
  const c = document.cookie.split('; ');
  const cookies = {};
  let i;
  let C;

  for (i = c.length - 1; i >= 0; i--) {
    C = c[i].split('=');
    cookies[C[0]] = C[1];
  }

  return cookies[name];
}

const GoogleTranslateScript = () => {
  // Back to english was retranslating the app so we have to clear the cookies and reload
  if (readCookie('googtrans') === '/en/en') {
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    // Delete also cookies on every trase domain
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=trase.earth';
    window.location.reload();
  }
  return (
    <>
      <div id="google_translate_element" className="google-translate" />
      <Helmet>
        <script
          src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          type="text/javascript"
        />
      </Helmet>
    </>
  );
};

export default GoogleTranslateScript;
