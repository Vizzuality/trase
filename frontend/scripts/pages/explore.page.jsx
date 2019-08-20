import BaseMarkup from 'html/base.ejs';

import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { Provider } from 'react-redux';

import TopNav from 'react-components/nav/top-nav/top-nav.container';
import LegacyExplore from 'react-components/legacy-explore/explore.container';
import Explore from 'react-components/explore';
import CookieBanner from 'react-components/shared/cookie-banner';
import Feedback from 'react-components/shared/feedback';

import 'styles/layouts/l-explore.scss';
import 'styles/components/shared/dropdown.scss';

export const mount = (root, store) => {
  root.innerHTML = BaseMarkup();

  render(
    <Provider store={store}>
      <TopNav />
    </Provider>,
    document.getElementById('nav')
  );

  render(
    <Provider store={store}>
      {ENABLE_REDESIGN_PAGES ? <Explore /> : <LegacyExplore />}
      <Feedback />
    </Provider>,
    document.getElementById('page-react-root')
  );

  render(
    <Provider store={store}>
      <CookieBanner />
    </Provider>,
    document.getElementById('cookie-banner')
  );
};

export const unmount = () => {
  unmountComponentAtNode(document.getElementById('nav'));
  unmountComponentAtNode(document.getElementById('page-react-root'));
  unmountComponentAtNode(document.getElementById('cookie-banner'));
};
