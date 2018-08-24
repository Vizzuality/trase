import BaseMarkup from 'html/base.ejs';
import FeedbackMarkup from 'html/includes/_feedback.ejs';

import 'styles/profile-actor.scss';
import 'styles/profile-place.scss';

import React, { StrictMode } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { Provider } from 'react-redux';
import TopNav from 'react-components/nav/top-nav/top-nav.container';

import ProfileNode from 'react-components/profile-node/profile-node.container';
import Footer from 'scripts/react-components/shared/footer.component';

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
        <ProfileNode />
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
  unmountComponentAtNode(document.getElementById('nav'));
  unmountComponentAtNode(document.getElementById('footer'));
  unmountComponentAtNode(document.getElementById('page-react-root'));
};
