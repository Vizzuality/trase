/* eslint-disable no-new */
import BaseMarkup from 'html/base.ejs';
import FeedbackMarkup from 'html/includes/_feedback.ejs';

import 'styles/data.scss';
import 'styles/components/shared/veil.scss';
import 'styles/components/shared/modal.scss';

import { render, unmountComponentAtNode } from 'react-dom';
import React, { StrictMode } from 'react';
import { Provider } from 'react-redux';
import TopNav from 'react-components/nav/top-nav/top-nav.container';
import Footer from 'react-components/shared/footer.component';

import DataPortalPage from 'react-components/data-portal/data-portal-page.container';

export const mount = (root, store) => {
  root.innerHTML = BaseMarkup({
    feedback: FeedbackMarkup()
  });

  render(
    <StrictMode>
      <Provider store={store}>
        <TopNav />
      </Provider>
    </StrictMode>,
    document.getElementById('nav')
  );

  render(
    <StrictMode>
      <Provider store={store}>
        <DataPortalPage />
      </Provider>
    </StrictMode>,
    document.getElementById('page-react-root')
  );

  render(
    <StrictMode>
      <Provider store={store}>
        <Footer />
      </Provider>
    </StrictMode>,
    document.getElementById('footer')
  );
};

export const unmount = () => {
  unmountComponentAtNode(document.getElementById('page-react-root'));
  unmountComponentAtNode(document.getElementById('nav'));
  unmountComponentAtNode(document.getElementById('footer'));
};
