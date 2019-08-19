import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import ToolSelector from 'react-components/tool-selector';
import Tool from 'react-components/tool';
import { Provider } from 'react-redux';
import BaseMarkup from 'html/base.ejs';
import FiltersNav from 'react-components/nav/filters-nav/filters-nav.container';
import Feedback from 'react-components/shared/feedback';
import CookieBanner from 'react-components/shared/cookie-banner';

export const mount = (root, store) => {
  root.innerHTML = BaseMarkup();
  const state = store.getState();
  const { editing } = state.toolSelector;
  render(
    <Provider store={store}>
      <FiltersNav />
    </Provider>,
    document.getElementById('nav')
  );

  render(
    <Provider store={store}>
      {editing && ENABLE_REDESIGN_PAGES ? <ToolSelector /> : <Tool />}
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
