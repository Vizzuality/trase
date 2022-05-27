import React from 'react';
import Helmet from 'react-helmet';

const GoogleTranslateScript = () => (
  <>
    <div id="google_translate_element" className="google-translate" />
    <Helmet
      script={[
        {
          type: 'text/javascript',
          innerHTML: `function googleTranslateElementInit() {
    new google.translate.TranslateElement({pageLanguage: 'en'}, 'google_translate_element');}`
        }
      ]}
    />
    <Helmet>
      <script
        src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        type="text/javascript"
      />
    </Helmet>
  </>
);

export default GoogleTranslateScript;
