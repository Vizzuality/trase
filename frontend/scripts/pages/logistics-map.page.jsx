import BaseMarkup from 'html/base.ejs';

import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { Provider } from 'react-redux';

import Feedback from 'react-components/shared/feedback';
import FiltersNav from 'react-components/nav/filters-nav/filters-nav.container';
import LogisticsMap from 'react-components/logistics-map/logistics-map.container';
import CookieBanner from 'react-components/shared/cookie-banner';

import 'styles/layouts/l-logistics-map.scss';
import 'styles/components/shared/dropdown.scss';

export const mount = (root, store) => {
  root.innerHTML = BaseMarkup();

  render(
    <Provider store={store}>
      <FiltersNav />
    </Provider>,
    document.getElementById('nav')
  );

  render(
    <Provider store={store}>
      <LogisticsMap />
      <Feedback />
    </Provider>,
    document.getElementById('page-react-root')
  );

  render(
    <Provider store={store}>
      <CookieBanner />
    </Provider>,
    document.getElementById('cookie-banner')
  );
};

export const unmount = () => {
  unmountComponentAtNode(document.getElementById('nav'));
  unmountComponentAtNode(document.getElementById('page-react-root'));
  unmountComponentAtNode(document.getElementById('cookie-banner'));
};