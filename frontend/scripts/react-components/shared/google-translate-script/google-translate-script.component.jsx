import React, { useMemo } from 'react';
import Helmet from 'react-helmet';
import LanguageSelector from './language-selector.component';

function readCookie(name) {
  const stringCookies = document.cookie.split('; ');
  const cookies = {};
  let i;
  let parsedCookie;
  for (i = stringCookies.length - 1; i >= 0; i--) {
    parsedCookie = stringCookies[i].split('=');
    cookies[parsedCookie[0]] = parsedCookie[1];
  }

  return cookies[name];
}
const LANGUAGES = ['en', 'pt', 'id', 'fr', 'es', 'zh-CN'];

const handleChangeCode = code => {
  if (code === 'en') {
    // delete cookie
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  } else {
    // set cookie
    document.cookie = `googtrans=/en/${code}`;
  }
  window.location.reload();
};

const GoogleTranslateScript = () => {
  const lang = useMemo(() => {
    const cookieLang = readCookie('googtrans');
    return cookieLang ? cookieLang.replace('/en/', '') : 'en';
  }, []);

  return (
    <>
      <LanguageSelector lang={lang} languages={LANGUAGES} onTranslate={handleChangeCode} />
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
