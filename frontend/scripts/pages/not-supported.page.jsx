import BaseMarkup from 'html/base.ejs';

import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { Provider } from 'react-redux';
import NotSupportedOnMobile from 'react-components/mobile/not-supported.component';
import TopNav from 'react-components/nav/top-nav/top-nav.container';
import Feedback from 'react-components/shared/feedback';

import 'styles/layouts/l-not-supported.scss';

export const mount = (root, store) => {
  root.innerHTML = BaseMarkup();

  render(
    <Provider store={store}>
      <TopNav />
    </Provider>,
    document.getElementById('nav')
  );

  render(
    <>
      <NotSupportedOnMobile />
      <Feedback />
    </>,
    document.getElementById('page-react-root')
  );
};

export const unmount = () => {
  unmountComponentAtNode(document.getElementById('page-react-root'));
  unmountComponentAtNode(document.getElementById('nav'));
};
