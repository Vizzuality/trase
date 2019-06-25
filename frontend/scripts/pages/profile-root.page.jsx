import BaseMarkup from 'html/base.ejs';

import 'styles/layouts/l-profile-root.scss';

import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { Provider } from 'react-redux';
import TopNav from 'react-components/nav/top-nav/top-nav.container';
import ProfileRoot from 'react-components/profile-root/profile-root.container';
import Footer from 'scripts/react-components/shared/footer/footer.component';
import CookieBanner from 'react-components/shared/cookie-banner';
import Feedback from 'react-components/shared/feedback';
import { loadTopNodes } from 'react-components/profile-root/profile-root.thunks';

export const mount = (root, store) => {
  root.innerHTML = BaseMarkup();

  loadTopNodes(store.dispatch, store.getState);

  render(
    <Provider store={store}>
      <TopNav />
    </Provider>,
    document.getElementById('nav')
  );

  render(
    <Provider store={store}>
      <ProfileRoot />
      <Feedback />
    </Provider>,
    document.getElementById('page-react-root')
  );

  if (NEW_PROFILES_PAGE) {
    render(
      <Provider store={store}>
        <Footer />
      </Provider>,
      document.getElementById('footer')
    );
  }

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
  if (NEW_PROFILES_PAGE) {
    unmountComponentAtNode(document.getElementById('footer'));
  }
};
