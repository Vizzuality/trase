/* eslint-disable no-new */
import DataMarkup from 'html/data.ejs';
import NavMarkup from 'html/includes/_nav.ejs';
import FooterMarkup from 'html/includes/_footer.ejs';
import FeedbackMarkup from 'html/includes/_feedback.ejs';
import NavContainer from 'containers/shared/nav.container';
import 'styles/data.scss';
import 'styles/components/shared/veil.scss';
import 'styles/components/shared/modal.scss';
import DataPortalPage from 'react-components/data-portal/data-portal-page.container';
import { render, unmountComponentAtNode } from 'react-dom';
import React from 'react';
import { Provider } from 'react-redux';

export const mount = (root, store) => {
  root.innerHTML = DataMarkup({
    nav: NavMarkup({ page: 'data' }),
    footer: FooterMarkup(),
    feedback: FeedbackMarkup()
  });

  render(
    <Provider store={store}>
      <DataPortalPage />
    </Provider>,
    document.querySelector('.c-container')
  );

  new NavContainer(store);
};

export const unmount = () => {
  unmountComponentAtNode(document.querySelector('.c-container'));
};
