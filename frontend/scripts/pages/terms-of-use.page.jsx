/* eslint-disable no-new */
import TermsOfUseMarkup from 'html/terms-of-use.ejs';
import NavMarkup from 'html/includes/_nav.ejs';
import FeedbackMarkup from 'html/includes/_feedback.ejs';

import 'styles/terms-of-use.scss';

import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { Provider } from 'react-redux';
import Footer from 'react-components/shared/footer.component';

import NavContainer from 'containers/shared/nav.container';

export const mount = (root, store) => {
  root.innerHTML = TermsOfUseMarkup({
    nav: NavMarkup({ page: 'terms-of-use' }),
    feedback: FeedbackMarkup()
  });

  render(
    <Provider store={store}>
      <Footer />
    </Provider>,
    document.getElementById('footer')
  );

  new NavContainer(store);
};

export const unmount = () => {
  unmountComponentAtNode(document.getElementById('footer'));
};
