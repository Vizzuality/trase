import BaseMarkup from 'html/base.ejs';
import FeedbackMarkup from 'html/includes/_feedback.ejs';

import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { Provider } from 'react-redux';

import FiltersNav from 'react-components/nav/filters-nav/filters-nav.container';
import Explore from 'react-components/explore/explore.component';

import 'styles/explore.scss';

export const mount = (root, store) => {
  root.innerHTML = BaseMarkup({
    feedback: FeedbackMarkup()
  });

  render(
    <Provider store={store}>
      <FiltersNav isExplore />
    </Provider>,
    document.getElementById('nav')
  );

  render(
    <Provider store={store}>
      <Explore />
    </Provider>,
    document.getElementById('page-react-root')
  );
};

export const unmount = () => {
  unmountComponentAtNode(document.getElementById('page-react-root'));
};
