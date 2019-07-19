import BaseMarkup from 'html/base.ejs';
import Feedback from 'react-components/shared/feedback';

import 'styles/layouts/l-profile-actor.scss';
import 'styles/layouts/l-profile-place.scss';
import 'styles/components/shared/dropdown.scss';
import 'styles/components/profiles/area-select.scss';
import 'styles/components/profiles/map.scss';
import 'styles/components/profiles/overall-info.scss';
import 'styles/components/profiles/info.scss';

import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { Provider } from 'react-redux';
import TopNav from 'react-components/nav/top-nav/top-nav.container';

import ProfileNode from 'react-components/profile-node/profile-node.container';
import Footer from 'scripts/react-components/shared/footer/footer.component';
import CookieBanner from 'react-components/shared/cookie-banner';

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
      <ProfileNode />
    </Provider>,
    document.getElementById('page-react-root')
  );

  if (!store.getState().location?.query?.print) {
    render(
      <Provider store={store}>
        <Footer />
        <Feedback />
      </Provider>,
      document.getElementById('footer')
    );

    render(
      <Provider store={store}>
        <CookieBanner />
      </Provider>,
      document.getElementById('cookie-banner')
    );
  }
};

export const unmount = (root, store) => {
  unmountComponentAtNode(document.getElementById('nav'));
  unmountComponentAtNode(document.getElementById('page-react-root'));
  if (!store.getState().location?.query?.print) {
    unmountComponentAtNode(document.getElementById('footer'));
    unmountComponentAtNode(document.getElementById('cookie-banner'));
  }
};
