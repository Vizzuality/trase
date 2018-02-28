/* eslint-disable no-new */

import ProfilePlaceMarkup from 'html/profile-place.ejs';
import FeedbackMarkup from 'html/includes/_feedback.ejs';

import 'styles/profile-place.scss';

import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { Provider } from 'react-redux';
import TopNav from 'react-components/nav/top-nav/top-nav.container';
import Footer from 'react-components/shared/footer.component';

import { withTranslation } from 'react-components/nav/locale-selector/with-translation.hoc';
import Dropdown from 'react-components/shared/dropdown.component';
import Line from 'react-components/profiles/line.component';
import LineLegend from 'react-components/profiles/line-legend.component';
import MiniSankey from 'react-components/profiles/mini-sankey.component';
import MultiTable from 'react-components/profiles/multi-table.component';
import Map from 'react-components/profiles/map.component';

import capitalize from 'lodash/capitalize';
import formatApostrophe from 'utils/formatApostrophe';
import formatValue from 'utils/formatValue';
import smoothScroll from 'utils/smoothScroll';

import { GET_PLACE_FACTSHEET_URL, getURLFromParams } from 'utils/getURLFromParams';
import { DEFAULT_PROFILE_PAGE_YEAR, TOOLTIPS } from 'constants';
import Tooltip from 'components/shared/info-tooltip.component';
import HelpTooltip from 'react-components/shared/help-tooltip.component';

const defaults = {
  country: 'Brazil',
  commodity: 'Soy'
};
const tooltips = TOOLTIPS.pages.profilePlace;
const tooltip = new Tooltip('.js-infowindow');

const TranslatedMiniSankey = withTranslation(MiniSankey);

const _buildMaps = (data, store) => {
  const stateGeoID = data.state_geo_id;
  const countryName = capitalize(data.country_name);

  const countryMapContainer = document.querySelector('.js-map-country');
  const biomeMapContainer = document.querySelector('.js-map-biome');
  const stateMapContainer = document.querySelector('.js-map-state');
  const municipalityMapContainer = document.querySelector('.js-map-municipality');

  render(
    <Provider store={store}>
      <Map
        height={countryMapContainer.clientHeight}
        topoJSONPath="./vector_layers/WORLD.topo.json"
        topoJSONRoot="world"
        useRobinsonProjection
        getPolygonClassName={d => (d.properties.name === countryName ? '-isCurrent' : '')}
      />
    </Provider>,
    countryMapContainer
  );

  render(
    <Provider store={store}>
      <Map
        height={biomeMapContainer.clientHeight}
        topoJSONPath={`./vector_layers/${defaults.country.toUpperCase()}_BIOME.topo.json`}
        topoJSONRoot={`${defaults.country.toUpperCase()}_BIOME`}
        getPolygonClassName={d => (d.properties.geoid === data.biome_geo_id ? '-isCurrent' : '')}
      />
    </Provider>,
    biomeMapContainer
  );

  render(
    <Provider store={store}>
      <Map
        height={stateMapContainer.clientHeight}
        topoJSONPath={`./vector_layers/${defaults.country.toUpperCase()}_STATE.topo.json`}
        topoJSONRoot={`${defaults.country.toUpperCase()}_STATE`}
        getPolygonClassName={d => (d.properties.geoid === stateGeoID ? '-isCurrent' : '')}
      />
    </Provider>,
    stateMapContainer
  );

  render(
    <Provider store={store}>
      <Map
        height={municipalityMapContainer.clientHeight}
        topoJSONPath={`./vector_layers/municip_states/${defaults.country.toLowerCase()}/${stateGeoID}.topo.json`}
        topoJSONRoot={`${defaults.country.toUpperCase()}_${stateGeoID}`}
        getPolygonClassName={d =>
          d.properties.geoid === data.municipality_geo_id ? '-isCurrent' : ''
        }
      />
    </Provider>,
    municipalityMapContainer
  );
};

const _build = (data, year, onLinkClick, store) => {
  _buildMaps(data, store);

  if (
    data.trajectory_deforestation &&
    data.trajectory_deforestation.lines &&
    data.trajectory_deforestation.lines.length
  ) {
    document.querySelector('.deforestation').classList.toggle('is-hidden', false);

    // Manually trim time series to 2010 - 2015 as asked here https://basecamp.com/1756858/projects/12498794/todos/324404665
    data.trajectory_deforestation.included_years = data.trajectory_deforestation.included_years.filter(
      includedYear => {
        const include = includedYear >= 2010;
        if (!include) {
          data.trajectory_deforestation.lines.forEach(line => {
            if (line.values !== undefined && line.values !== null) {
              line.values.shift();
            }
          });
        }
        return include;
      }
    );

    render(
      <Provider store={store}>
        <Line
          data={data.trajectory_deforestation}
          xValues={data.trajectory_deforestation.included_years}
          settings={{
            margin: { top: 0, right: 20, bottom: 30, left: 60 },
            height: 425,
            ticks: {
              yTicks: 7,
              yTickPadding: 10,
              yTickFormatType: 'deforestation-trajectory',
              xTickPadding: 15
            }
          }}
        />
      </Provider>,
      document.querySelector('.js-line')
    );

    render(
      <Provider store={store}>
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

  const showTooltipCallback = (source, indicator, value, unit, x, y) =>
    tooltip.show(x, y, source, [
      {
        title: indicator,
        value: formatValue(value, indicator),
        unit
      }
    ]);

  const topConsumerActorsContainer = document.getElementById('js-traders-sankey-container');
  const topConsumerCountriesContainer = document.getElementById('js-consumers-sankey-container');

  if (data && data.top_consumer_actors.targetNodes.length > 0) {
    topConsumerActorsContainer.classList.toggle('is-hidden', false);
    render(
      <Provider store={store}>
        <TranslatedMiniSankey
          data={data.top_consumer_actors}
          targetLink="profileActor"
          year={year}
          showTooltipCallback={showTooltipCallback}
          hideTooltipCallback={tooltip.hide}
          onLinkClick={onLinkClick}
        />
      </Provider>,
      document.getElementById('js-traders-sankey')
    );
  } else {
    topConsumerActorsContainer.classList.toggle('is-hidden', true);
  }

  if (data && data.top_consumer_countries.targetNodes.length > 0) {
    topConsumerCountriesContainer.classList.toggle('is-hidden', false);

    render(
      <Provider store={store}>
        <TranslatedMiniSankey
          data={data.top_consumer_countries}
          year={year}
          showTooltipCallback={showTooltipCallback}
          hideTooltipCallback={tooltip.hide}
          onLinkClick={onLinkClick}
        />
      </Provider>,
      document.getElementById('js-consumers-sankey')
    );
  } else {
    topConsumerCountriesContainer.classList.toggle('is-hidden', true);
  }

  if (data.indicators.length) {
    render(
      <Provider store={store}>
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
  document.querySelector('.js-country-name').innerHTML = info.country
    ? capitalize(info.country)
    : '-';
  document.querySelector('.js-state-name').innerHTML = info.state ? capitalize(info.state) : '-';
  // document.querySelector('.js-chord-consumers-state-name').innerHTML = info.state ? info.state : '-';
  // document.querySelector('.js-chord-traders-state-name').innerHTML = info.state ? info.state : '-';
  document.querySelector('.js-biome-name').innerHTML = info.biome ? capitalize(info.biome) : '-';
  document.querySelector('.js-legend').innerHTML = info.type || '-';
  document.querySelector('.js-municipality').innerHTML = info.municipality
    ? capitalize(info.municipality)
    : '-';
  document.querySelector('.js-area').innerHTML =
    info.area !== null ? formatValue(info.area, 'area') : '-';
  document.querySelector('.js-soy-land').innerHTML =
    info.soy_area !== null && info.soy_area !== 'NaN' ? formatValue(info.soy_area, 'area') : '-';
  document.querySelector('.js-soy-production').innerHTML =
    info.soy_production !== null ? formatValue(info.soy_production, 'tons') : '-';
  document.querySelector('.js-link-map').addEventListener('click', () =>
    onLinkClick('tool', {
      selectedNodesIds: [nodeId],
      isMapVisible: true,
      selectedYears: [year, year]
    })
  );
  document
    .querySelector('.js-link-supply-chain')
    .addEventListener('click', () =>
      onLinkClick('tool', { selectedNodesIds: [nodeId], selectedYears: [year, year] })
    );
  document.querySelector('.js-line-title').innerHTML = info.municipality
    ? `Deforestation trajectory of ${info.municipality}`
    : '-';
  document.querySelector('.js-traders-title').innerHTML = `Top traders of soy in ${
    info.municipality
  } in ${year}`;
  document.querySelector(
    '.js-consumers-title'
  ).innerHTML = `Top importer countries of ${formatApostrophe(
    capitalize(info.municipality)
  )} soy in ${year}`;
  document.querySelector('.js-link-button-municipality').textContent = `${formatApostrophe(
    capitalize(info.municipality)
  )} PROFILE`;

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
    document.querySelector('.js-loading').classList.remove('is-hidden');
    document.querySelector('.js-wrap').classList.add('is-hidden');
  } else {
    document.querySelector('.js-loading').classList.add('is-hidden');
    document.querySelector('.js-wrap').classList.remove('is-hidden');
  }
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

const onLinkClick = store => (type, params) => store.dispatch({ type, payload: { query: params } });

const _switchYear = (store, nodeId, dropdownYear) => {
  setLoading();
  // eslint-disable-next-line no-use-before-define
  _loadData(store, nodeId, dropdownYear);
  store.dispatch({
    type: 'profilePlace',
    payload: { query: { nodeId, year: dropdownYear } }
  });
};

const _loadData = (store, nodeId, year) => {
  const placeFactsheetURL = getURLFromParams(GET_PLACE_FACTSHEET_URL, {
    context_id: 1,
    node_id: nodeId,
    year
  });
  setLoading();

  fetch(placeFactsheetURL)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(result => {
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
          size="big"
          value={year}
          valueList={[2010, 2011, 2012, 2013, 2014, 2015]}
          onValueSelected={dropdownYear => _switchYear(store, nodeId, dropdownYear)}
        />,
        document.getElementById('year-dropdown')
      );

      _build(data, year, onLinkClick(store), store);
    })
    .catch(reason => {
      _showErrorMessage(reason.message);
      console.error(reason);
    });
};

export const mount = (root, store) => {
  const { query = {} } = store.getState().location;
  const { nodeId, print = false } = query;
  const year = query.year ? parseInt(query.year, 10) : DEFAULT_PROFILE_PAGE_YEAR;

  root.innerHTML = ProfilePlaceMarkup({
    printMode: print,
    feedback: FeedbackMarkup()
  });

  render(<HelpTooltip text={tooltips.soyLand} />, document.getElementById('soy-land-tooltip'));
  render(
    <HelpTooltip text={tooltips.soyProduction} />,
    document.getElementById('soy-production-tooltip')
  );

  render(
    <Provider store={store}>
      <Footer />
    </Provider>,
    document.getElementById('footer')
  );

  render(
    <Provider store={store}>
      <TopNav />
    </Provider>,
    document.getElementById('nav')
  );

  _loadData(store, nodeId, year);
};

export const unmount = () => {
  unmountComponentAtNode(document.getElementById('js-traders-sankey'));
  unmountComponentAtNode(document.getElementById('js-consumers-sankey'));
  unmountComponentAtNode(document.querySelector('.js-map-country'));
  unmountComponentAtNode(document.querySelector('.js-map-biome'));
  unmountComponentAtNode(document.querySelector('.js-map-state'));
  unmountComponentAtNode(document.querySelector('.js-map-municipality'));
  unmountComponentAtNode(document.querySelector('.js-line'));
  unmountComponentAtNode(document.querySelector('.js-line-legend'));
  unmountComponentAtNode(document.querySelector('.js-score-table'));
  unmountComponentAtNode(document.getElementById('soy-land-tooltip'));
  unmountComponentAtNode(document.getElementById('soy-production-tooltip'));
  unmountComponentAtNode(document.getElementById('year-dropdown'));
  unmountComponentAtNode(document.getElementById('nav'));
  unmountComponentAtNode(document.getElementById('footer'));
};
