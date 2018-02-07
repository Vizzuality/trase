/* eslint-disable max-len,no-new */

import BaseMarkup from 'html/base.ejs';
import FeedbackMarkup from 'html/includes/_feedback.ejs';

import 'styles/static-content.scss';

import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { Provider } from 'react-redux';

import StaticContent from 'react-components/static-content/static-content.container';
import TopNavBar from 'react-components/shared/nav/top-nav-bar.container';
import Footer from 'react-components/shared/footer.component';

export const mount = (root, store) => {
  root.innerHTML = BaseMarkup({
    feedback: FeedbackMarkup()
  });

  render(
    <Provider store={store}>
      <TopNavBar />
    </Provider>,
    document.getElementById('nav')
  );

  render(
    <Provider store={store}>
      <StaticContent />
    </Provider>,
    document.getElementById('page-react-root')
  );

  render(
    <Provider store={store}>
      <Footer />
    </Provider>,
    document.getElementById('footer')
  );
};

export const unmount = () => {
  unmountComponentAtNode(document.getElementById('page-react-root'));
  unmountComponentAtNode(document.getElementById('nav'));
  unmountComponentAtNode(document.getElementById('footer'));
};
