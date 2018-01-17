/* eslint-disable no-new */
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
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
import Dropdown from 'react-components/shared/dropdown.component';
import Top from 'react-components/profiles/top.component';
import Line from 'react-components/profiles/line.component';
import LineLegend from 'react-components/profiles/line-legend.component';
import Chord from 'react-components/profiles/chord.component';
import MiniSankey from 'react-components/profiles/mini-sankey.component';
import MultiTable from 'react-components/profiles/multi-table.component';
import Map from 'react-components/profiles/map.component';

import formatApostrophe from 'utils/formatApostrophe';
import formatValue from 'utils/formatValue';
import smoothScroll from 'utils/smoothScroll';

import { GET_PLACE_FACTSHEET, getURLFromParams } from 'utils/getURLFromParams';
import { DEFAULT_PROFILE_PAGE_YEAR } from 'constants';

const defaults = {
  country: 'Brazil',
  commodity: 'Soy'
};

const _buildMaps = (data, store) => {
  const stateGeoID = data.state_geo_id;
  const countryName = capitalize(data.country_name);

  const countryMapContainer = document.querySelector('.js-map-country');
  const biomeMapContainer = document.querySelector('.js-map-biome');
  const stateMapContainer = document.querySelector('.js-map-state');
  const municipalityMapContainer = document.querySelector('.js-map-municipality');

  render(
    <Provider store={store} >
      <Map
        width={countryMapContainer.clientWidth}
        height={countryMapContainer.clientHeight}
        topoJSONPath="./vector_layers/WORLD.topo.json"
        topoJSONRoot="world"
        useRobinsonProjection
        getPolygonClassName={d => (d.properties.name === countryName ? '-isCurrent' : '')}
        isStaticComponent
      />
    </Provider>,
    countryMapContainer
  );

  render(
    <Provider store={store} >
      <Map
        width={biomeMapContainer.clientWidth}
        height={biomeMapContainer.clientHeight}
        topoJSONPath={`./vector_layers/${defaults.country.toUpperCase()}_BIOME.topo.json`}
        topoJSONRoot={`${defaults.country.toUpperCase()}_BIOME`}
        getPolygonClassName={d => (d.properties.geoid === data.biome_geo_id ? '-isCurrent' : '')}
        isStaticComponent
      />
    </Provider>,
    biomeMapContainer
  );

  render(
    <Provider store={store} >
      <Map
        width={stateMapContainer.clientWidth}
        height={stateMapContainer.clientHeight}
        topoJSONPath={`./vector_layers/${defaults.country.toUpperCase()}_STATE.topo.json`}
        topoJSONRoot={`${defaults.country.toUpperCase()}_STATE`}
        getPolygonClassName={d => (d.properties.geoid === stateGeoID ? '-isCurrent' : '')}
        isStaticComponent
      />
    </Provider>,
    stateMapContainer
  );

  render(
    <Provider store={store} >
      <Map
        width={municipalityMapContainer.clientWidth}
        height={municipalityMapContainer.clientHeight}
        topoJSONPath={`./vector_layers/municip_states/${defaults.country.toLowerCase()}/${stateGeoID}.topo.json`}
        topoJSONRoot={`${defaults.country.toUpperCase()}_${stateGeoID}`}
        getPolygonClassName={d => (d.properties.geoid === data.municipality_geo_id ? '-isCurrent' : '')}
        isStaticComponent
      />
    </Provider>,
    municipalityMapContainer
  );
};

const _build = (data, { year, showMiniSankey }, store) => {
  _buildMaps(data, store);

  if (
    data.trajectory_deforestation
    && data.trajectory_deforestation.lines
    && data.trajectory_deforestation.lines.length
  ) {
    document.querySelector('.deforestation').classList.toggle('is-hidden', false);

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

    render(
      <Provider store={store} >
        <Line
          className=".js-line"
          data={data.trajectory_deforestation}
          xValues={data.trajectory_deforestation.included_years}
          settings={{
            margin: { top: 0, right: 40, bottom: 30, left: 99 },
            height: 425,
            ticks: {
              yTicks: 7,
              yTickPadding: 52,
              yTickFormatType: 'deforestation-trajectory',
              xTickPadding: 15
            }
          }}
        />
      </Provider>,
      document.querySelector('.js-line')
    );

    render(
      <Provider store={store} >
        <LineLegend
          data={data.trajectory_deforestation}
          xValues={data.trajectory_deforestation.included_years}
        />
      </Provider>,
      document.querySelector('.js-line-legend')
    );
  } else {
    document.querySelector('.deforestation').classList.toggle('is-hidden', true);
  }

  if (showMiniSankey === 'true') {
    document.querySelectorAll('.mini-sankey-container')
      .forEach((el) => {
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
      document.querySelector('.js-traders')
        .classList
        .toggle('is-hidden', false);

      const tradersChordContainer = document.querySelector('.js-chord-traders-container');

      render(
        <Chord
          width={tradersChordContainer.clientWidth}
          height={tradersChordContainer.clientWidth}
          orgMatrix={data.top_traders.matrix}
          list={data.top_traders.municipalities}
          list2={data.top_traders.actors}
          name={data.state_name}
        />,
        tradersChordContainer
      );

      render(
        <Top
          data={data.top_traders.actors}
          targetLink="actor"
          title={`Top traders of soy in ${data.municipality_name} in ${year}`}
          unit="%"
          year={year}
        />,
        document.querySelector('.js-top-trader')
      );
    }

    if (data.top_consumers.countries.length) {
      const consumersChordContainer = document.querySelector('.js-chord-consumers-container');

      document.querySelector('.js-consumers')
        .classList
        .toggle('is-hidden', false);

      render(
        <Chord
          width={consumersChordContainer.clientWidth}
          height={consumersChordContainer.clientWidth}
          orgMatrix={data.top_consumers.matrix}
          list={data.top_consumers.municipalities}
          list2={data.top_consumers.countries}
          name={data.state_name}
        />,
        consumersChordContainer
      );

      render(
        <Top
          data={data.top_consumers.countries}
          title={`Top importer countries of ${formatApostrophe(capitalize(data.municipality_name))} soy in ${year}`}
          unit="%"
        />,
        document.querySelector('.js-top-consumer')
      );
    }
  }

  if (data.indicators.length) {
    render(
      <Provider store={store} >
        <MultiTable
          id="sustainability-indicators"
          data={data.indicators}
          tabsTitle="Sustainability indicators:"
          type="t_head_places"
          target={item => (item.name === 'Municipalities' ? 'profilePlace' : null)}
          year={year}
        />
      </Provider>,
      document.querySelector('.js-score-table')
    );
  }
};

const _setInfo = (store, info, onLinkClick, { nodeId, year }) => {
  document.querySelector('.js-country-name').innerHTML = info.country ? capitalize(info.country) : '-';
  document.querySelector('.js-state-name').innerHTML = info.state ? capitalize(info.state) : '-';
  // document.querySelector('.js-chord-consumers-state-name').innerHTML = info.state ? info.state : '-';
  // document.querySelector('.js-chord-traders-state-name').innerHTML = info.state ? info.state : '-';
  document.querySelector('.js-biome-name').innerHTML = info.biome ? capitalize(info.biome) : '-';
  document.querySelector('.js-legend').innerHTML = info.type || '-';
  document.querySelector('.js-municipality').innerHTML = info.municipality ? capitalize(info.municipality) : '-';
  document.querySelector('.js-area').innerHTML = info.area !== null ? formatValue(info.area, 'area') : '-';
  document.querySelector('.js-soy-land').innerHTML =
    (info.soy_area !== null && info.soy_area !== 'NaN') ? formatValue(info.soy_area, 'area') : '-';
  document.querySelector('.js-soy-production').innerHTML =
    info.soy_production !== null ? formatValue(info.soy_production, 'tons') : '-';
  document.querySelector('.js-link-map')
    .addEventListener(
      'click',
      () => onLinkClick('tool', { selectedNodesIds: [nodeId], isMapVisible: true, selectedYears: [year, year] })
    );
  document.querySelector('.js-link-supply-chain')
    .addEventListener(
      'click',
      () => onLinkClick('tool', { selectedNodesIds: [nodeId], selectedYears: [year, year] })
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


const setLoading = (isLoading = true) => {
  if (isLoading) {
    document.querySelector('.js-loading')
      .classList
      .remove('is-hidden');
    document.querySelector('.js-wrap')
      .classList
      .add('is-hidden');
  } else {
    document.querySelector('.js-loading')
      .classList
      .add('is-hidden');
    document.querySelector('.js-wrap')
      .classList
      .remove('is-hidden');
  }
};

const _showErrorMessage = (message = null) => {
  const el = document.querySelector('.l-profile-place');
  document.querySelector('.js-loading')
    .classList
    .add('is-hidden');
  el.classList.add('-error');
  el.querySelector('.js-wrap')
    .classList
    .add('is-hidden');
  el.querySelector('.js-error-message')
    .classList
    .remove('is-hidden');
  if (message !== null && message !== '') {
    el.querySelector('.js-message').innerHTML = message;
  }
};

const onLinkClick = store => (type, params) => store.dispatch({ type, payload: { query: params } });

const _switchYear = (store, nodeId, dropdownYear, showMiniSankey) => {
  setLoading();
  // eslint-disable-next-line no-use-before-define
  _loadData(store, nodeId, dropdownYear, showMiniSankey);
  store.dispatch({
    type: 'profilePlace',
    payload: { query: { nodeId, year: dropdownYear, showMiniSankey } }
  });
};

const _loadData = (store, nodeId, year, showMiniSankey) => {
  const placeFactsheetURL = getURLFromParams(GET_PLACE_FACTSHEET, { context_id: 1, node_id: nodeId, year });
  setLoading();

  fetch(placeFactsheetURL)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then((result) => {
      if (!result) return;

      setLoading(false);

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

      _setInfo(store, info, onLinkClick(store), { nodeId, year });
      _setEventListeners();

      render(
        <Dropdown
          label="Year"
          value={year}
          valueList={[2010, 2011, 2012, 2013, 2014, 2015]}
          onValueSelected={dropdownYear => _switchYear(store, nodeId, dropdownYear, showMiniSankey)}
        />,
        document.getElementById('year-dropdown')
      );

      _build(data, { year, showMiniSankey }, store);
    })
    .catch((reason) => {
      _showErrorMessage(reason.message);
      console.error(reason);
    });
};

export const mount = (root, store) => {
  const { query = {} } = store.getState().location;
  const { nodeId, showMiniSankey = false, print = false } = query;
  const year = query.year ? parseInt(query.year, 10) : DEFAULT_PROFILE_PAGE_YEAR;

  root.innerHTML = ProfilePlaceMarkup({
    printMode: print,
    nav: NavMarkup({ page: 'profile-place' }),
    footer: FooterMarkup(),
    feedback: FeedbackMarkup()
  });

  _loadData(store, nodeId, year, showMiniSankey);

  new NavContainer(store);
};

