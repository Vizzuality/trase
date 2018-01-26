/* eslint-disable max-len,no-new */

import BaseMarkup from 'html/base.ejs';
import FeedbackMarkup from 'html/includes/_feedback.ejs';

import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { Provider } from 'react-redux';
import Home from 'react-components/home/home.container';
import Nav from 'react-components/shared/nav.component';
import Footer from 'react-components/shared/footer.component';

import 'styles/homepage.scss';


export const mount = (root, store) => {
  root.innerHTML = BaseMarkup({
    feedback: FeedbackMarkup()
  });

  render(
    <Provider store={store}>
      <Nav />
    </Provider>,
    document.getElementById('nav')
  );

  render(
    <Provider store={store} >
      <Home />
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
