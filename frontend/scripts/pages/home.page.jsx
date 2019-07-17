import BaseMarkup from 'html/base.ejs';

import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { Provider } from 'react-redux';
import Home from 'react-components/home/home.container';
import TopNav from 'react-components/nav/top-nav/top-nav.container';
import CookieBanner from 'react-components/shared/cookie-banner';
import Footer from 'react-components/shared/footer/footer.component';
import Feedback from 'react-components/shared/feedback';

import 'styles/layouts/l-homepage.scss';

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
      <Home />
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
