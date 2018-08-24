import BaseMarkup from 'html/base.ejs';
import FeedbackMarkup from 'html/includes/_feedback.ejs';

import React, { StrictMode } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { Provider } from 'react-redux';

import FiltersNav from 'react-components/nav/filters-nav/filters-nav.container';
import TopNav from 'react-components/nav/top-nav/top-nav.container';
import Explore from 'react-components/explore/explore.container';
import ResizeListener from 'react-components/shared/resize-listener.component';

import 'styles/explore.scss';

export const mount = (root, store) => {
  root.innerHTML = BaseMarkup({
    feedback: FeedbackMarkup()
  });

  render(
    <StrictMode>
      <Provider store={store}>
        <ResizeListener>
          {({ resolution }) =>
            resolution.isSmall ? <TopNav className="-light" /> : <FiltersNav isExplore />
          }
        </ResizeListener>
      </Provider>
    </StrictMode>,
    document.getElementById('nav')
  );

  render(
    <StrictMode>
      <Provider store={store}>
        <Explore />
      </Provider>
    </StrictMode>,
    document.getElementById('page-react-root')
  );
};

export const unmount = () => {
  unmountComponentAtNode(document.getElementById('nav'));
  unmountComponentAtNode(document.getElementById('page-react-root'));
};
