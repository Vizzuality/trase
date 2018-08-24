import BaseMarkup from 'html/base.ejs';
import FeedbackMarkup from 'html/includes/_feedback.ejs';

import React, { StrictMode } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { Provider } from 'react-redux';
import Home from 'react-components/home/home.container';
import TopNav from 'react-components/nav/top-nav/top-nav.container';
import Footer from 'react-components/shared/footer.component';

import 'styles/homepage.scss';

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
        <Home />
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
