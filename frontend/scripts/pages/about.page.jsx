/* eslint-disable max-len,no-new */

import AboutMarkup from 'html/about.ejs';
import NavMarkup from 'html/includes/_nav.ejs';
import FeedbackMarkup from 'html/includes/_feedback.ejs';

import 'styles/about.scss';

import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { Provider } from 'react-redux';

import About from 'react-components/about/about.component';
import Footer from 'react-components/shared/footer.component';

import NavContainer from 'containers/shared/nav.container';


export const mount = (root, store) => {
  root.innerHTML = AboutMarkup({
    nav: NavMarkup({ page: 'index' }),
    feedback: FeedbackMarkup()
  });
  new NavContainer(store);

  render(
    <Provider store={store} >
      <About />
    </Provider>,
    document.getElementById('about-react-root')
  );

  render(
    <Provider store={store}>
      <Footer />
    </Provider>,
    document.getElementById('footer')
  );
};

export const unmount = () => {
  unmountComponentAtNode(document.getElementById('about-react-root'));
  unmountComponentAtNode(document.getElementById('footer'));
};
