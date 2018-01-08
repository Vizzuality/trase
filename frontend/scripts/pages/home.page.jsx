/* eslint-disable max-len,no-new */

import HomeMarkup from 'html/home.ejs';
import FooterMarkup from 'html/includes/_footer.ejs';
import NavMarkup from 'html/includes/_nav.ejs';
import FeedbackMarkup from 'html/includes/_feedback.ejs';

import React from 'react';
import { render } from 'react-dom';
import HomeComponent from 'react-components/home/home.component';

import NavContainer from 'containers/shared/nav.container';
import 'styles/homepage.scss';

import { getURLFromParams, POST_SUBSCRIBE_NEWSLETTER } from 'utils/getURLFromParams';

// TODO: Move this to redux
function submitForm(email) {
  const body = new FormData();
  body.append('email', email);

  const url = getURLFromParams(POST_SUBSCRIBE_NEWSLETTER);

  fetch(url, {
    method: 'POST',
    body
  })
    .then(res => (res.ok ? res.json() : Promise.reject(res.statusText)))
    .then((data) => {
      debugger;
      const label = document.querySelector('.newsletter-label');

      label.classList.add('-pink');
      if ('error' in data) {
        label.innerHTML = `Error: ${data.error}`;
      } else if ('email' in data) {
        label.innerHTML = 'Subscription successful';
      }
    })
    .catch((err) => {
      const label = document.querySelector('.newsletter-label');
      label.classList.add('-pink');
      label.innerHTML = `Error: ${err}`;
    });
}

export const mount = (root, store) => {
  root.innerHTML = HomeMarkup({
    footer: FooterMarkup(),
    nav: NavMarkup({ page: 'index' }),
    feedback: FeedbackMarkup()
  });
  new NavContainer(store);

  render(<HomeComponent submitForm={submitForm} />, document.getElementById('home-react-root'));
};
