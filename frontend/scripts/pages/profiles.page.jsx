/* eslint-disable no-new */
import ProfilesMarkup from 'html/profiles.ejs';
import FeedbackMarkup from 'html/includes/_feedback.ejs';

import 'styles/profiles.scss';

import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { Provider } from 'react-redux';
import Footer from 'react-components/shared/footer.component';

import values from 'lodash/values';
import Search from 'components/shared/search.component';
import { GET_ALL_NODES, getURLFromParams } from 'utils/getURLFromParams';
import { DEFAULT_PROFILE_PAGE_YEAR } from 'constants';
import capitalize from 'lodash/capitalize';

const _showErrorMessage = (message) => {
  const el = document.querySelector('.l-profiles');
  el.classList.add('-error');
  el.querySelector('.js-loading')
    .classList
    .add('is-hidden');
  el.querySelector('.container')
    .classList
    .add('is-hidden');
  el.querySelector('.js-error-message')
    .classList
    .remove('is-hidden');
  if (message !== null) {
    el.querySelector('.js-message').innerHTML = message;
  }
};

const _setSearch = (goToPage) => {
  const onNodeSelected = (node) => {
    goToPage(`profile${capitalize(node.profileType)}`, { nodeId: node.id, year: DEFAULT_PROFILE_PAGE_YEAR });
  };

  const allNodesURL = getURLFromParams(GET_ALL_NODES, { context_id: 1 });

  fetch(allNodesURL)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      _showErrorMessage(response.statusText);
      return null;
    })
    .then((result) => {
      if (!result) return;

      document.querySelector('.js-loading')
        .classList
        .add('is-hidden');

      const search = new Search();
      search.onCreated();

      const nodesArray = values(result.data)
        .filter(node =>
          node.isUnknown !== true &&
          node.isAggregated !== true &&
          node.isDomesticConsumption !== true &&
          node.profileType !== undefined && node.profileType !== null);

      search.callbacks = {
        onNodeSelected
      };

      search.loadNodes(nodesArray);
    })
    .catch(
      reason => _showErrorMessage(reason.message)
    );
};

export const mount = (root, store) => {
  root.innerHTML = ProfilesMarkup({
    feedback: FeedbackMarkup()
  });

  render(
    <Provider store={store}>
      <Footer />
    </Provider>,
    document.getElementById('footer')
  );

  const goToPage = (type, params) => store.dispatch({ type, payload: { query: params } });

  _setSearch(goToPage);
};

export const unmount = () => {
  unmountComponentAtNode(document.getElementById('footer'));
};
