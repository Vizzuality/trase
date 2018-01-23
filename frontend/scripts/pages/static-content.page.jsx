/* eslint-disable max-len,no-new */

import BaseMarkup from 'html/base.ejs';
import NavMarkup from 'html/includes/_nav.ejs';
import FeedbackMarkup from 'html/includes/_feedback.ejs';

import 'styles/static-content.scss';

import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { Provider } from 'react-redux';

import StaticContent from 'react-components/static-content/static-content.container';
import Footer from 'react-components/shared/footer.component';

import NavContainer from 'containers/shared/nav.container';


export const mount = (root, store) => {
  root.innerHTML = BaseMarkup({
    nav: NavMarkup({ page: 'index' }),
    feedback: FeedbackMarkup()
  });
  new NavContainer(store);

  render(
    <Provider store={store} >
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
  unmountComponentAtNode(document.getElementById('footer'));
};
