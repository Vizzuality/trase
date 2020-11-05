import React, { lazy, Suspense, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import TopNav from 'react-components/nav/top-nav/top-nav.container';
import CookieBanner from 'react-components/shared/cookie-banner';
import FullScreenButton from 'react-components/shared/full-screen-button';
import Feedback from 'react-components/shared/feedback';
import Footer from 'react-components/shared/footer/footer.component';

import isIe from 'utils/isIe';
import isIframe from 'utils/isIframe';

import SeoHandler from './seo-handler.component';

import 'styles/_layouts.scss';

const pageContent = {
  team: lazy(() => import('../react-components/team/team.container')),
  teamMember: lazy(() => import('../react-components/team/team-member/team-member.container')),
  about: lazy(() =>
    import('../react-components/static-content/markdown-renderer/markdown-renderer.container')
  )
};

function App() {
  const { routesMap, type, query } = useSelector(state => state.location);
  const { Component, layout, footer = true, feedback = true } = routesMap[type];
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
        <Component key={pageKey} content={layout && layout(pageContent[type])} />

        {!isInIframe && <CookieBanner />}
        {isInIframe && <FullScreenButton />}
        {feedback && <Feedback />}
      </main>

      {footer && (
        <footer>
          <Footer />
        </footer>
      )}
      <div id="recharts-tooltip-portal" />
    </Suspense>
  );
}

export default App;
