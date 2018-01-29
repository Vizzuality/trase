/* eslint-disable max-len,no-new */

import BaseMarkup from 'html/base.ejs';
import NavMarkup from 'html/includes/_nav.ejs';
import FeedbackMarkup from 'html/includes/_feedback.ejs';

import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { Provider } from 'react-redux';
import Home from 'react-components/home/home.container';
import Footer from 'react-components/shared/footer.component';

import NavContainer from 'containers/shared/nav.container';
import 'styles/homepage.scss';


export const mount = (root, store) => {
  root.innerHTML = BaseMarkup({
    nav: NavMarkup({ page: 'index' }),
    feedback: FeedbackMarkup()
  });
  new NavContainer(store);

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
  unmountComponentAtNode(document.getElementById('footer'));
};
