import React, { lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';
import TopNav from 'react-components/nav/top-nav/top-nav.container';
import CookieBanner from 'react-components/shared/cookie-banner';
import Feedback from 'react-components/shared/feedback';
import Footer from 'react-components/shared/footer/footer.component';

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

  const pageKey = type === 'profileNode' ? `${type}-${query?.nodeId}` : type;
  return (
    <Suspense fallback={null}>
      <nav>
        <TopNav />
      </nav>
      <main>
        <Component key={pageKey} content={layout && layout(pageContent[type])} />
        <CookieBanner />
        {feedback && <Feedback />}
      </main>
      {footer && (
        <footer>
          <Footer />
        </footer>
      )}
    </Suspense>
  );
}

export default App;
