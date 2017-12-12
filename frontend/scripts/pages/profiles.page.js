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

  const allNodesURL = getURLFromParams(GET_ALL_NODES, { context_id: 1 });

  fetch(allNodesURL)
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

_setSearch();
new Nav();
