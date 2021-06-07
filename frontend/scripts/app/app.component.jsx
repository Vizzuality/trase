import React, { lazy, Suspense, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import NewCookieBanner from 'react-components/shared/new-cookie-banner';
import FullScreenButton from 'react-components/shared/full-screen-button';
import Feedback from 'react-components/shared/feedback';
import NewFooter from 'react-components/shared/new-footer/footer.component';

import isIe from 'utils/isIe';
import isIframe from 'utils/isIframe';

import SeoHandler from './seo-handler.component';

import 'styles/_layouts.scss';

const TopNav = lazy(() =>
  import('react-components/nav/top-nav-redesign/top-nav-redesign.container')
);

function App() {
  const { routesMap, type, query } = useSelector(state => state.location);
  const { Component, footer = true, feedback = true } = routesMap[type];
  const [isInIframe, setIsInIframe] = useState(false);
  const pageKey = type === 'profile' ? `${type}-${query?.nodeId}` : type;

  useEffect(() => {
    if (isIe()) {
      document.body.classList.add('-is-legacy-browser');
    }
    if (isIframe()) setIsInIframe(true);
  }, []);

  return (
    <Suspense fallback={null}>
      <SeoHandler />
      <nav>
        <TopNav />
      </nav>
      <main>
        <Component key={pageKey} />

        {!isInIframe && <NewCookieBanner />}
        {isInIframe && <FullScreenButton />}
        {feedback && <Feedback />}
      </main>

      {footer && (
        <footer>
          <NewFooter />
        </footer>
      )}
      <div id="recharts-tooltip-portal" />
    </Suspense>
  );
}

export default App;
