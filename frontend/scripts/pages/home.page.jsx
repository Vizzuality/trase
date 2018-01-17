/* eslint-disable max-len,no-new */

import HomeMarkup from 'html/home.ejs';
import FooterMarkup from 'html/includes/_footer.ejs';
import NavMarkup from 'html/includes/_nav.ejs';
import FeedbackMarkup from 'html/includes/_feedback.ejs';

import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { Provider } from 'react-redux';
import Home from 'react-components/home/home.container';

import NavContainer from 'containers/shared/nav.container';
import 'styles/homepage.scss';


export const mount = (root, store) => {
  root.innerHTML = HomeMarkup({
    footer: FooterMarkup(),
    nav: NavMarkup({ page: 'index' }),
    feedback: FeedbackMarkup()
  });
  new NavContainer(store);

  render(
    <Provider store={store} >
      <Home />
    </Provider>,
    document.getElementById('home-react-root')
  );
};

export const unmount = () => {
  unmountComponentAtNode(document.getElementById('home-react-root'));
};
