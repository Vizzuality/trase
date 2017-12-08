import ProfilesMarkup from 'html/profiles.ejs';
import NavMarkup from 'html/includes/_nav.ejs';
import FooterMarkup from 'html/includes/_footer.ejs';

import Nav from 'components/shared/nav.component.js';
import 'styles/_base.scss';
import 'styles/_texts.scss';
import 'styles/_foundation.css';
import 'styles/layouts/l-profiles.scss';
import 'styles/components/shared/nav.scss';
import 'styles/components/shared/spinner.scss';
import 'styles/components/shared/_footer.scss';

import _ from 'lodash';

import Search from 'components/shared/search.component.js';
import { getURLFromParams, GET_ALL_NODES } from '../utils/getURLFromParams';
import getProfileLink from 'utils/getProfileLink';

const _setSearch = () => {

  const onNodeSelected = function(node) {
    window.location.href = getProfileLink(node);
  };

  const allNodesURL = getURLFromParams(GET_ALL_NODES);

  fetch(`${allNodesURL}&context_id=1`)
    .then(response => response.json())
    .then((result) => {

      document.querySelector('.js-loading').classList.add('is-hidden');

      const search = new Search();
      search.onCreated();

      const nodesArray = _.values(result.data)
        .filter(node =>
          node.isUnknown !== true &&
          node.isAggregated !== true &&
          node.isDomesticConsumption !== true &&
          node.profileType !== undefined && node.profileType !== null
      );

      search.callbacks = {
        onNodeSelected
      };

      search.loadNodes(nodesArray);
    });
};

export const renderPage = (root) => {
  root.innerHTML = ProfilesMarkup({ nav: NavMarkup({ page: 'profiles' }), footer: FooterMarkup() });
  _setSearch();
  new Nav();
};
