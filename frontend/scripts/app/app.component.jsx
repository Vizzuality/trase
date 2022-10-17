import React, { lazy, Suspense, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import CookieBanner from 'react-components/shared/cookie-banner';
import FullScreenButton from 'react-components/shared/full-screen-button';
import Feedback from 'react-components/shared/feedback';
import Footer from 'react-components/shared/footer/footer.component';

import isIe from 'utils/isIe';
import isIframe from 'utils/isIframe';

import SeoHandler from './seo-handler.component';

import 'styles/_layouts.scss';

const TopNav = lazy(() => import('react-components/nav/top-nav/top-nav.container'));

const pageContent = {
  about: lazy(() =>
    import('../react-components/static-content/markdown-renderer/markdown-renderer.container')
  )
};

// This code fixes the problem with the google translate making react resilient to its DOM mutations
// https://github.com/facebook/react/issues/11538#issuecomment-417504600

const fixGoogleTranslateNodeRemoval = () => {
  if (typeof Node === 'function' && Node.prototype) {
    const originalRemoveChild = Node.prototype.removeChild;
    Node.prototype.removeChild = function removeChild(child) {
      if (child.parentNode !== this) {
        if (console) {
          console.error('Cannot remove a child from a different parent', child, this);
        }
        return child;
      }
      // eslint-disable-next-line prefer-rest-params
      return originalRemoveChild.apply(this, arguments);
    };

    const originalInsertBefore = Node.prototype.insertBefore;
    Node.prototype.insertBefore = function insertBefore(newNode, referenceNode) {
      if (referenceNode && referenceNode.parentNode !== this) {
        if (console) {
          console.error(
            'Cannot insert before a reference node from a different parent',
            referenceNode,
            this
          );
        }
        return newNode;
      }
      // eslint-disable-next-line prefer-rest-params
      return originalInsertBefore.apply(this, arguments);
    };
  }
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

    fixGoogleTranslateNodeRemoval();
  }, []);

  return (
    <>
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
    </>
  );
}

export default App;
