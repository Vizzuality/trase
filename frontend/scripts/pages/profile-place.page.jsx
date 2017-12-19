/* eslint-disable no-new */
import React from 'react';
import { render } from 'react-dom';
import ProfilePlaceMarkup from 'html/profile-place.ejs';
import NavMarkup from 'html/includes/_nav.ejs';
import FooterMarkup from 'html/includes/_footer.ejs';
import FeedbackMarkup from 'html/includes/_feedback.ejs';

import 'styles/_base.scss';
import 'styles/_texts.scss';
import 'styles/_foundation.css';
import 'styles/layouts/l-profile-place.scss';
import 'styles/components/shared/dropdown.scss';
import 'styles/components/shared/button.scss';
import 'styles/components/shared/spinner.scss';
import 'styles/components/shared/nav.scss';
import 'styles/components/shared/_footer.scss';
import 'styles/components/profiles/overall-info.scss';
import 'styles/components/profiles/info.scss';
import 'styles/components/profiles/link-buttons.scss';
import 'styles/components/profiles/error.scss';
import 'styles/components/profiles/map.scss';

import capitalize from 'lodash/capitalize';

import NavContainer from 'containers/shared/nav.container';
import Dropdown from 'components/shared/dropdown.component';
import Top from 'components/profiles/top.component';
import Line from 'components/profiles/line.component';
import Chord from 'components/profiles/chord.component';
import MiniSankey from 'react-components/profiles/mini-sankey.component';
import MultiTable from 'components/profiles/multi-table.component';
import Map from 'components/profiles/map.component';

import formatApostrophe from 'utils/formatApostrophe';
import formatValue from 'utils/formatValue';
import swapProfileYear from 'utils/swapProfileYear';
import smoothScroll from 'utils/smoothScroll';

import { GET_PLACE_FACTSHEET, getURLFromParams } from 'utils/getURLFromParams';

const defaults = {
  country: 'Brazil',
  commodity: 'Soy'
};

const _build = (data, { year, showMiniSankey }) => {
  const stateGeoID = data.state_geo_id;
  const countryName = capitalize(data.country_name);

  Map('.js-map-country', {
    topoJSONPath: './vector_layers/WORLD.topo.json',
    topoJSONRoot: 'world',
    getPolygonClassName: d => (d.properties.name === countryName ? '-isCurrent' : ''),
    useRobinsonProjection: true
  });

  Map('.js-map-biome', {
    topoJSONPath: `./vector_layers/${defaults.country.toUpperCase()}_BIOME.topo.json`,
    topoJSONRoot: `${defaults.country.toUpperCase()}_BIOME`,
    getPolygonClassName: d => (d.properties.geoid === data.biome_geo_id ? '-isCurrent' : '')
  });

  Map('.js-map-state', {
    topoJSONPath: `./vector_layers/${defaults.country.toUpperCase()}_STATE.topo.json`,
    topoJSONRoot: `${defaults.country.toUpperCase()}_STATE`,
    getPolygonClassName: d => (d.properties.geoid === stateGeoID ? '-isCurrent' : '')
  });

  Map('.js-map-municipality', {
    topoJSONPath: `./vector_layers/municip_states/${defaults.country.toLowerCase()}/${stateGeoID}.topo.json`,
    topoJSONRoot: `${defaults.country.toUpperCase()}_${stateGeoID}`,
    getPolygonClassName: d => (d.properties.geoid === data.municipality_geo_id ? '-isCurrent' : '')
  });

  if (
    data.trajectory_deforestation
    && data.trajectory_deforestation.lines
    && data.trajectory_deforestation.lines.length
  ) {
    // Manually trim time series to 2010 - 2015 as asked here https://basecamp.com/1756858/projects/12498794/todos/324404665
    data.trajectory_deforestation.included_years =
      data.trajectory_deforestation.included_years.filter((includedYear) => {
        const include = includedYear >= 2010;
        if (!include) {
          data.trajectory_deforestation.lines.forEach((line) => {
            if (line.values !== undefined && line.values !== null) {
              line.values.shift();
            }
          });
        }
        return include;
      });

    new Line(
      '.js-line',
      data.trajectory_deforestation,
      data.trajectory_deforestation.included_years,
      {
        margin: { top: 0, right: 40, bottom: 30, left: 99 },
        height: 425,
        ticks: {
          yTicks: 7,
          yTickPadding: 52,
          yTickFormatType: 'deforestation-trajectory',
          xTickPadding: 15
        }
      }
    );
  } else {
    const elem = document.querySelector('.js-line-title');
    elem.parentNode.parentNode.parentNode.removeChild(elem.parentNode.parentNode);
  }

  if (showMiniSankey) {
    document.querySelectorAll('.mini-sankey-container').forEach((el) => {
      el.classList.toggle('is-hidden', false);
    });

    // query: nodeId, targetColumnId + commodity and year
    const tradersSankeyData = {
      name: 'QUERÊNCIA',
      targetNodes: [{
        id: 2,
        name: 'Other',
        isAggregated: true,
        height: 0.2
        // isDomesticConsumption: null,
      }, {
        id: 588,
        name: 'Cargill',
        height: 0.4
      }, {
        id: 588,
        name: 'Hello, I have such a long name I need 3 lines',
        height: 0.2
      }, {
        id: 588,
        name: 'Sometimes, you gotta have more lines',
        height: 0.1
      }, {
        id: 588,
        name: 'Cargill',
        height: 0.029
      }, {
        id: 588,
        name: 'Cargill',
        height: 0.021
      }, {
        id: 588,
        name: 'Im very long but sadly the node hieght is too small',
        height: 0.05
      }]
    };

    // query: nodeId, targetColumnId + commodity and year
    const consumersSankeyData = {
      name: 'QUERÊNCIA',
      targetNodes: [{
        name: 'Others',
        isAggregated: true,
        height: 0.2
      }, {
        name: 'China',
        height: 0.4
      }, {
        name: 'Brazil',
        height: 0.2
      }, {
        name: 'Germany',
        height: 0.1
      }, {
        name: 'South Korea',
        height: 0.029
      }, {
        name: 'Thailand',
        height: 0.021
      }, {
        name: 'Spain',
        height: 0.05
      }]
    };

    render(
      <MiniSankey
        data={tradersSankeyData}
        targetLink="actor"
      />,
      document.getElementById('js-traders-sankey')
    );

    render(
      <MiniSankey
        data={consumersSankeyData}
      />,
      document.getElementById('js-consumers-sankey')
    );
  } else {
    if (data.top_traders.actors.length) {
      document.querySelector('.js-traders').classList.toggle('is-hidden', false);

      new Chord(
        '.js-chord-traders',
        data.top_traders.matrix,
        data.top_traders.municipalities,
        data.top_traders.actors
      );

      new Top({
        el: document.querySelector('.js-top-trader'),
        data: data.top_traders.actors,
        targetLink: 'actor',
        title: `Top traders of soy in ${data.municipality_name} in ${year}`,
        unit: '%',
        year
      });
    }

    if (data.top_consumers.countries.length) {
      document.querySelector('.js-consumers').classList.toggle('is-hidden', false);

      new Chord(
        '.js-chord-consumers',
        data.top_consumers.matrix,
        data.top_consumers.municipalities,
        data.top_consumers.countries
      );

      new Top({
        el: document.querySelector('.js-top-consumer'),
        data: data.top_consumers.countries,
        title: `Top importer countries of ${formatApostrophe(capitalize(data.municipality_name))} soy in ${year}`,
        unit: '%'
      });
    }
  }

  if (data.indicators.length) {
    new MultiTable({
      el: document.querySelector('.js-score-table'),
      data: data.indicators,
      tabsTitle: 'Sustainability indicators:',
      type: 't_head_places',
      year
    });
  }
};

const _setInfo = (info, { nodeId, year }) => {
  document.querySelector('.js-country-name').innerHTML = info.country ? capitalize(info.country) : '-';
  document.querySelector('.js-state-name').innerHTML = info.state ? capitalize(info.state) : '-';
  document.querySelector('.js-biome-name').innerHTML = info.biome ? capitalize(info.biome) : '-';
  document.querySelector('.js-legend').innerHTML = info.type || '-';
  document.querySelector('.js-municipality').innerHTML = info.municipality ? capitalize(info.municipality) : '-';
  document.querySelector('.js-area').innerHTML = info.area !== null ? formatValue(info.area, 'area') : '-';
  document.querySelector('.js-soy-land').innerHTML =
    (info.soy_area !== null && info.soy_area !== 'NaN') ? formatValue(info.soy_area, 'area') : '-';
  document.querySelector('.js-soy-production').innerHTML =
    info.soy_production !== null ? formatValue(info.soy_production, 'tons') : '-';
  document.querySelector('.js-link-map').setAttribute(
    'href',
    `./flows?selectedNodesIds=[${nodeId}]&isMapVisible=true&selectedYears=[${year},${year}]`
  );
  document.querySelector('.js-link-supply-chain').setAttribute(
    'href',
    `./flows?selectedNodesIds=[${nodeId}]&isMapVisible=true&selectedYears=[${year},${year}]`
  );
  document.querySelector('.js-line-title').innerHTML =
    info.municipality ? `Deforestation trajectory of ${info.municipality}` : '-';
  document.querySelector('.js-traders-title').innerHTML =
    `Top traders of soy in ${info.municipality} in ${year}`;
  document.querySelector('.js-consumers-title').innerHTML =
    `Top importer countries of ${formatApostrophe(capitalize(info.municipality))} soy in ${year}`;
  document.querySelector('.js-link-button-municipality').textContent =
    `${formatApostrophe(capitalize(info.municipality))} PROFILE`;

  if (info.soy_production === 0) {
    info.summary = `${info.municipality} did not produce any soy in ${year}`;
  }
  document.querySelector('.js-summary-text').innerHTML = info.summary ? info.summary : '-';
};

const _setEventListeners = () => {
  smoothScroll(document.querySelectorAll('.js-link-profile'));
};

const _showErrorMessage = (message = null) => {
  const el = document.querySelector('.l-profile-place');
  document.querySelector('.js-loading').classList.add('is-hidden');
  el.classList.add('-error');
  el.querySelector('.js-wrap').classList.add('is-hidden');
  el.querySelector('.js-error-message').classList.remove('is-hidden');
  if (message !== null && message !== '') {
    el.querySelector('.js-message').innerHTML = message;
  }
};

export const mount = (root, store) => {
  const { query = {} } = store.getState().location;
  const { nodeId, year = 2015, showMiniSankey = false } = query;

  root.innerHTML = ProfilePlaceMarkup({
    nav: NavMarkup({ page: 'profile-place' }),
    footer: FooterMarkup(),
    feedback: FeedbackMarkup()
  });

  const placeFactsheetURL = getURLFromParams(GET_PLACE_FACTSHEET, { context_id: 1, node_id: nodeId, year });

  fetch(placeFactsheetURL)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then((result) => {
      if (!result) return;
      document.querySelector('.js-loading').classList.add('is-hidden');
      document.querySelector('.js-wrap').classList.remove('is-hidden');

      const data = result.data;

      const info = {
        area: data.area,
        agriculture_land: data.farming_GDP,
        biome: data.biome_name,
        country: data.country_name,
        municipality: data.municipality_name,
        soy_area: data.soy_area,
        soy_production: data.soy_production,
        state: data.state_name,
        type: data.column_name,
        summary: data.summary
      };

      _setInfo(info, { nodeId, year });
      _setEventListeners();

      const yearDropdown = new Dropdown('year', swapProfileYear);
      yearDropdown.setTitle(year);

      _build(data, { year, showMiniSankey });
    })
    .catch(reason => _showErrorMessage(reason.message));

  new NavContainer(store);
};

