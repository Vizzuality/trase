import BaseMarkup from 'html/base.ejs';

import 'styles/layouts/l-data.scss';
import 'styles/components/data/custom-dataset.scss';
import 'styles/components/shared/veil.scss';
import 'styles/components/shared/modal.scss';

import { render, unmountComponentAtNode } from 'react-dom';
import React from 'react';
import { Provider } from 'react-redux';
import TopNav from 'react-components/nav/top-nav/top-nav.container';
import Footer from 'react-components/shared/footer/footer.component';
import CookieBanner from 'react-components/shared/cookie-banner';
import Feedback from 'react-components/shared/feedback';

import DataPortalPage from 'react-components/data-portal/data-portal.container';

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
      <DataPortalPage />
    </Provider>,
    document.getElementById('page-react-root')
  );

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
};

export const unmount = () => {
  unmountComponentAtNode(document.getElementById('page-react-root'));
  unmountComponentAtNode(document.getElementById('nav'));
  unmountComponentAtNode(document.getElementById('footer'));
  unmountComponentAtNode(document.getElementById('cookie-banner'));
};
