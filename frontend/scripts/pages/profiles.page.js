/* eslint-disable no-new */
import ProfilesMarkup from 'html/profiles.ejs';
import NavMarkup from 'html/includes/_nav.ejs';
import FooterMarkup from 'html/includes/_footer.ejs';
import FeedbackMarkup from 'html/includes/_feedback.ejs';

import NavContainer from 'containers/shared/nav.container';
import 'styles/_base.scss';
import 'styles/_texts.scss';
import 'styles/_foundation.css';
import 'styles/layouts/l-profiles.scss';
import 'styles/components/shared/nav.scss';
import 'styles/components/shared/spinner.scss';
import 'styles/components/shared/_footer.scss';
import 'styles/components/profiles/error.scss';

import _ from 'lodash';

import Search from 'components/shared/search.component';
import { GET_ALL_NODES, getURLFromParams } from 'utils/getURLFromParams';
import getProfileLink from 'utils/getProfileLink';

const _showErrorMessage = (message) => {
  const el = document.querySelector('.l-profiles');
  el.classList.add('-error');
  el.querySelector('.js-loading').classList.add('is-hidden');
  el.querySelector('.container').classList.add('is-hidden');
  el.querySelector('.js-error-message').classList.remove('is-hidden');
  if (message !== null) {
    el.querySelector('.js-message').innerHTML = message;
  }
};

const _setSearch = () => {
  const onNodeSelected = (node) => {
    window.location.href = getProfileLink(node);
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

      document.querySelector('.js-loading').classList.add('is-hidden');

      const search = new Search();
      search.onCreated();

      const nodesArray = _.values(result.data)
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
    nav: NavMarkup({ page: 'profiles' }),
    footer: FooterMarkup(),
    feedback: FeedbackMarkup()
  });
  _setSearch();
  new NavContainer(store);
};

