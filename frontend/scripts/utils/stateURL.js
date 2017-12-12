import _ from 'lodash';

export const getURLParams = url => {
  const objParams = {};

  // removes '?' character from URL
  url = url.slice(1);

  // splits every param in the URL to a new array
  const splitedParams = url.split('&');

  // Loops params creating a new param object
  splitedParams.forEach((p) => {
    const param = p.split('=');

    if (param[0]) {
      objParams[param[0]] = param[1] || null;
    }

  });

  return objParams;
};

const URL_STATE_PROPS = [
  'selectedContextId',
  'selectedYears',
  'detailedView',
  'selectedNodesIds',
  'expandedNodesIds',
  'areNodesExpanded',
  'selectedColumnsIds',
  'selectedMapDimensions',
  'isMapVisible',
  'mapView',
  'expandedMapSidebarGroupsIds',
  'selectedMapContextualLayers',
  'selectedMapBasemap'
];

const URL_PARAMS_PROPS = [
  'isMapVisible',
  'selectedNodesIds',
  'selectedYears'
];

const filterStateToURL = state => {
  if (_.isEmpty(state)) {
    return {};
  }

  const stateToSave = _.pick(state, URL_STATE_PROPS);

  stateToSave.selectedResizeByName = state.selectedResizeBy ? state.selectedResizeBy.name : null;
  stateToSave.selectedRecolorByName = state.selectedRecolorBy ? state.selectedRecolorBy.name : null;
  stateToSave.selectedBiomeFilterName = state.selectedBiomeFilter ? state.selectedBiomeFilter.name : null;

  return stateToSave;
};

export const encodeStateToURL = state => {
  const urlProps = JSON.stringify(filterStateToURL(state));
  const encoded = btoa(urlProps);
  window.history.replaceState({}, 'Title', `?state=${encoded}`);
  return encoded;
};

function _getURLParameterByName(name, url) {
  if (!url) {
    url = window.location.href;
  }
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
  const results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

export const decodeStateFromURL = urlHash => {
  const state = (urlHash === undefined) ? {} : JSON.parse(atob(urlHash));

  // if URL contains GET parameters, override hash state prop with it
  URL_PARAMS_PROPS.forEach(prop => {
    let urlParam = _getURLParameterByName(prop);
    if (urlParam) {
      switch (prop) {
        case 'selectedNodesIds': {
          urlParam = urlParam.replace(/\[|\]/gi, '').split(',').map(nodeId => parseInt(nodeId));
          state.areNodesExpanded = true;
          state.expandedNodesIds = urlParam;
          break;
        }
        case 'selectedYears': {
          urlParam = urlParam.replace(/\[|\]/gi, '').split(',').map(year => parseInt(year));
          break;
        }
        case 'isMapVisible': {
          urlParam = (urlParam === 'true') ? true : false;
          break;
        }
      }
      state[prop] = urlParam;
    }
  });

  return state;
};
