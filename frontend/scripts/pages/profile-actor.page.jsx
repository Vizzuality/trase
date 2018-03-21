/* eslint-disable no-new */
import Tooltip from 'components/shared/info-tooltip.component';
import { ACTORS_TOP_SOURCES_SWITCHERS_BLACKLIST, DEFAULT_PROFILE_PAGE_YEAR } from 'constants';
import FeedbackMarkup from 'html/includes/_feedback.ejs';
import ProfileActorMarkup from 'html/profile-actor.ejs';
import capitalize from 'lodash/capitalize';
import React from 'react';
import { withTranslation } from 'react-components/nav/locale-selector/with-translation.hoc';
import TopNav from 'react-components/nav/top-nav/top-nav.container';
import ChoroLegend from 'react-components/profiles/choro-legend.component';
import DropdownTabSwitcher from 'react-components/profiles/dropdown-tab-switcher.component';
import Line from 'react-components/profiles/line.component';
import Map from 'react-components/profiles/map.component';
import MultiTable from 'react-components/profiles/multi-table.component';
import Scatterplot from 'react-components/profiles/scatterplot.component';
import Dropdown from 'react-components/shared/dropdown.component';
import Footer from 'react-components/shared/footer.component';
import HelpTooltip from 'react-components/shared/help-tooltip.component';
import { render, unmountComponentAtNode } from 'react-dom';
import { Provider } from 'react-redux';
import 'styles/profile-actor.scss';
import formatApostrophe from 'utils/formatApostrophe';
import formatValue from 'utils/formatValue';
import {
  GET_ACTOR_FACTSHEET_URL,
  GET_TOOLTIPS_URL,
  getURLFromParams
} from 'utils/getURLFromParams';

import smoothScroll from 'utils/smoothScroll';

const defaults = {
  country: 'Brazil',
  commodity: 'soy'
};
const TranslatedLine = withTranslation(Line);
const tooltip = new Tooltip('.js-infowindow');
const LINE_MARGINS = {
  top: 10,
  right: 100,
  bottom: 25,
  left: 50
};
let lineSettings;

const _initSource = (selectedSource, data, store) => {
  if (data.top_sources === undefined) {
    return;
  }

  const sourceLines = Object.assign({}, data.top_sources[selectedSource]);

  sourceLines.lines = sourceLines.lines.slice(0, 5);

  const settings = Object.assign({}, lineSettings, {
    margin: LINE_MARGINS,
    height: 244
  });

  render(
    <Provider store={store}>
      <TranslatedLine
        className=".js-top-municipalities"
        data={sourceLines}
        xValues={data.top_sources.included_years}
        settings={settings}
        useBottomLegend
      />
    </Provider>,
    document.querySelector('.js-top-municipalities')
  );

  const topoJSONPath = `./vector_layers/${defaults.country.toUpperCase()}_${selectedSource.toUpperCase()}.topo.json`;
  const topoJSONRoot = `${defaults.country.toUpperCase()}_${selectedSource.toUpperCase()}`;
  const getPolygonClassName = ({ properties }) => {
    const source = data.top_sources[selectedSource].lines.find(s => properties.geoid === s.geo_id);
    let value = 'n-a';
    if (source) value = source.value9 || 'n-a';
    return `-outline ch-${value}`;
  };
  const showTooltipCallback = ({ properties }, x, y) => {
    const source = data.top_sources[selectedSource].lines.find(s => properties.geoid === s.geo_id);
    const title = `${data.node_name} > ${properties.nome.toUpperCase()}`;

    if (source) {
      tooltip.show(x, y, title, [
        {
          title: 'Trade Volume',
          value: formatValue(source.values[0], 'Trade volume'),
          unit: 't'
        }
      ]);
    }
  };

  const containerElement = document.querySelector('.js-top-municipalities-map');

  render(
    <Provider store={store}>
      <Map
        width={containerElement.clientWidth}
        height={400}
        topoJSONPath={topoJSONPath}
        topoJSONRoot={topoJSONRoot}
        getPolygonClassName={getPolygonClassName}
        showTooltipCallback={showTooltipCallback}
        hideTooltipCallback={tooltip.hide}
      />
    </Provider>,
    containerElement
  );
};

const _setTopSourceSwitcher = (data, verb, year, store) => {
  const nodeName = capitalize(data.node_name);
  const title = `Top sourcing regions of Soy ${verb} by ${nodeName} in ${year}:`;
  const items = Object.keys(data.top_sources).filter(
    key => !ACTORS_TOP_SOURCES_SWITCHERS_BLACKLIST.includes(key)
  );

  render(
    <Provider store={store}>
      <DropdownTabSwitcher
        title={title}
        items={items}
        onSelectedIndexChange={index => _initSource(items[index], data, store)}
      />
    </Provider>,
    document.querySelector('.js-top-municipalities-title-container')
  );
};

const _build = (data, tooltips, { nodeId, year, print }, store) => {
  const verb = data.column_name === 'EXPORTER' ? 'exported' : 'imported';
  const verbGerund = data.column_name === 'EXPORTER' ? 'exporting' : 'importing';

  render(
    <HelpTooltip text={tooltips.zeroDeforestationCommitment} position="bottom" />,
    document.getElementById('zero-deforestation-tooltip')
  );
  render(
    <HelpTooltip text={tooltips.forest500Score} position="bottom" />,
    document.getElementById('forest-500-tooltip')
  );

  lineSettings = {
    margin: {
      top: 10,
      right: 100,
      bottom: 30,
      left: 50
    },
    height: 244,
    ticks: {
      yTicks: 6,
      yTickPadding: 10,
      yTickFormatType: 'top-location',
      xTickPadding: 15
    },
    showTooltipCallback: (location, x, y) => {
      tooltip.show(
        x,
        y,
        `${location.name.toUpperCase()} > ${data.node_name}, ${location.date.getFullYear()}`,
        [
          {
            title: 'Trade volume',
            value: formatValue(location.value, 'Trade volume'),
            unit: 't'
          }
        ]
      );
    },
    hideTooltipCallback: tooltip.hide,
    lineClassNameCallback: (lineData, lineDefaultStyle) =>
      `${lineDefaultStyle} line-${lineData[0].value9}`
  };

  if (data.top_sources && data.top_sources.municipality.lines.length) {
    _setTopSourceSwitcher(data, verb, year, store);

    render(
      <Provider store={store}>
        <ChoroLegend
          title={[`Soy ${verb} in ${year}`, '(tonnes)']}
          bucket={[[data.top_sources.buckets[0], ...data.top_sources.buckets]]}
        />
      </Provider>,
      document.querySelector('.js-source-legend')
    );

    _initSource(print === true ? 'state' : 'municipality', data, store);
  }

  if (data.top_countries && data.top_countries.lines.length) {
    document.querySelector(
      '.js-top-map-title'
    ).textContent = `Top destination countries of Soy ${verb} by ${capitalize(
      data.node_name
    )} in ${year}`;

    render(
      <Provider store={store}>
        <ChoroLegend
          title={[`Soy ${verb} in ${year}`, '(tonnes)']}
          bucket={[[data.top_countries.buckets[0], ...data.top_countries.buckets]]}
        />
      </Provider>,
      document.querySelector('.js-destination-legend')
    );

    const topCountriesLines = Object.assign({}, data.top_countries);

    topCountriesLines.lines = topCountriesLines.lines.slice(0, 5);

    const settings = Object.assign({}, lineSettings, {
      showTooltipCallback: (location, x, y) => {
        tooltip.show(
          x,
          y,
          `${data.node_name} > ${location.name.toUpperCase()}, ${location.date.getFullYear()}`,
          [
            {
              title: 'Trade volume',
              value: formatValue(location.value, 'Trade volume'),
              unit: 't'
            }
          ]
        );
      }
    });

    render(
      <Provider store={store}>
        <TranslatedLine
          className=".js-top-destination"
          data={topCountriesLines}
          xValues={data.top_countries.included_years}
          settings={settings}
          useBottomLegend
        />
      </Provider>,
      document.querySelector('.js-top-destination')
    );

    const getPolygonClassName = ({ properties }) => {
      const country = data.top_countries.lines.find(c => properties.iso2 === c.geo_id);
      let value = 'n-a';
      if (country) value = country.value9 || 'n-a';
      return `-outline ch-${value}`;
    };
    const showTooltipCallback = ({ properties }, x, y) => {
      const country = data.top_countries.lines.find(
        c => properties.name.toUpperCase() === c.name.toUpperCase()
      );
      const title = `${properties.name.toUpperCase()} > ${data.node_name}`;
      if (country) {
        tooltip.show(x, y, title, [
          {
            title: 'Trade Volume',
            value: formatValue(country.values[0], 'Trade volume'),
            unit: 't'
          }
        ]);
      }
    };

    const containerElement = document.querySelector('.js-top-destination-map');

    render(
      <Provider store={store}>
        <Map
          width={containerElement.clientWidth}
          height={containerElement.clientHeight}
          topoJSONPath="./vector_layers/WORLD.topo.json"
          topoJSONRoot="world"
          useRobinsonProjection
          getPolygonClassName={getPolygonClassName}
          showTooltipCallback={showTooltipCallback}
          hideTooltipCallback={tooltip.hide}
        />
      </Provider>,
      containerElement
    );
  }

  if (data.sustainability && data.sustainability.length) {
    const tabsTitle = `Deforestation risk associated with ${formatApostrophe(
      data.node_name
    )} top sourcing regions in ${year}:`;

    render(
      <Provider store={store}>
        <MultiTable
          id="sustainability"
          data={data.sustainability}
          tabsTitle={tabsTitle}
          tabsTitleTooltip={tooltips.deforestationRisk}
          type="t_head_actors"
          target={item => (item.name === 'Municipalities' ? 'profilePlace' : null)}
          year={year}
        />
      </Provider>,
      document.querySelector('.js-sustainability-table')
    );
  }

  if (data.companies_sourcing) {
    const showTooltipCallback = (company, indicator, x, y) => {
      tooltip.show(x, y, company.name, [
        {
          title: data.companies_sourcing.dimension_y.name,
          value: formatValue(company.y, data.companies_sourcing.dimension_y.name),
          unit: data.companies_sourcing.dimension_y.unit
        },
        {
          title: indicator.name,
          value: formatValue(company.x, indicator.name),
          unit: indicator.unit
        }
      ]);
    };

    const scatterplotContainerElement = document.querySelector('.js-scatterplot-container');
    const scatterplotTitle = `Comparing companies ${verbGerund} Soy from Brazil in ${year}`;

    render(
      <Provider store={store}>
        <Scatterplot
          width={scatterplotContainerElement.clientWidth}
          title={scatterplotTitle}
          data={data.companies_sourcing.companies}
          xDimension={data.companies_sourcing.dimensions_x}
          node={{ id: nodeId, name: data.node_name }}
          year={year}
          showTooltipCallback={showTooltipCallback}
          hideTooltipCallback={tooltip.hide}
        />
      </Provider>,
      scatterplotContainerElement
    );
  }
};

const _setInfo = (info, onLinkClick, { nodeId, year }) => {
  document.querySelector('.js-name').textContent = info.name ? capitalize(info.name) : '-';
  document.querySelector('.js-link-button-name').textContent = `${formatApostrophe(
    capitalize(info.name)
  )} PROFILE`;
  document.querySelector('.js-legend').textContent = info.type || '-';
  document.querySelector('.js-country').textContent = info.country ? capitalize(info.country) : '-';
  if (info.forest_500 > 0) {
    document
      .querySelector('.js-forest-500-score .circle-icon[data-value="1"] use')
      .setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#icon-circle-filled');
  }
  if (info.forest_500 > 1) {
    document
      .querySelector('.js-forest-500-score .circle-icon[data-value="2"] use')
      .setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#icon-circle-filled');
  }
  if (info.forest_500 > 2) {
    document
      .querySelector('.js-forest-500-score .circle-icon[data-value="3"] use')
      .setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#icon-circle-filled');
  }
  if (info.forest_500 > 3) {
    document
      .querySelector('.js-forest-500-score .circle-icon[data-value="4"] use')
      .setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#icon-circle-filled');
  }
  if (info.forest_500 > 4) {
    document
      .querySelector('.js-forest-500-score .circle-icon[data-value="5"] use')
      .setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#icon-circle-filled');
  }
  if (info.zero_deforestation === 'YES') {
    document
      .querySelector('.js-zero-deforestation-commitment [data-value="yes"]')
      .classList.remove('is-hidden');
  } else {
    document
      .querySelector('.js-zero-deforestation-commitment [data-value="no"]')
      .classList.remove('is-hidden');
  }
  document.querySelector('.js-link-map').addEventListener('click', () =>
    onLinkClick('tool', {
      state: { isMapVisible: true, selectedNodesIds: [nodeId], selectedYears: [year, year] }
    })
  );

  document
    .querySelector('.js-link-supply-chain')
    .addEventListener('click', () =>
      onLinkClick('tool', { state: { selectedNodesIds: [nodeId], selectedYears: [year, year] } })
    );
  document.querySelector('.js-summary-text').textContent = info.summary ? info.summary : '-';
};

const _setEventListeners = () => {
  smoothScroll([].slice.call(document.querySelectorAll('.js-link-profile')));
};

const onLinkClick = store => (type, params) => store.dispatch({ type, payload: { query: params } });

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
  const el = document.querySelector('.l-profile-actor');
  el.classList.add('-error');
  document.querySelector('.js-loading').classList.add('is-hidden');
  el.querySelector('.js-wrap').classList.add('is-hidden');
  el.querySelector('.js-error-message').classList.remove('is-hidden');
  if (message !== null && message !== '') {
    el.querySelector('.js-message').innerHTML = message;
  }
};

const _switchYear = (store, nodeId, dropdownYear, showMiniSankey) => {
  setLoading();
  // eslint-disable-next-line no-use-before-define
  _loadData(store, nodeId, dropdownYear, showMiniSankey);
  store.dispatch({
    type: 'profileActor',
    payload: { query: { nodeId, year: dropdownYear, showMiniSankey } }
  });
};

const _loadData = (store, nodeId, year) => {
  const actorFactsheetURL = getURLFromParams(GET_ACTOR_FACTSHEET_URL, {
    context_id: 1,
    node_id: nodeId,
    year
  });
  setLoading();
  const tooltipsURL = getURLFromParams(GET_TOOLTIPS_URL);

  Promise.all(
    [actorFactsheetURL, tooltipsURL].map(url =>
      fetch(url).then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.statusText);
      })
    )
  )
    .then(response => {
      if (!response) return;

      const tooltips = response[1].profileActor;
      const data = response[0].data;

      setLoading(false);

      const info = {
        type: data.column_name,
        name: data.node_name,
        country: data.country_name,
        forest_500: data.forest_500,
        zero_deforestation: data.zero_deforestation,
        summary: data.summary
      };

      _setInfo(info, onLinkClick(store), { nodeId, year });
      _setEventListeners();

      render(
        <Dropdown
          size="big"
          label="Year"
          value={year}
          valueList={[2010, 2011, 2012, 2013, 2014, 2015]}
          onValueSelected={dropdownYear => _switchYear(store, nodeId, dropdownYear)}
        />,
        document.getElementById('year-dropdown')
      );

      _build(data, tooltips, { nodeId, year }, store);
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

  root.innerHTML = ProfileActorMarkup({
    printMode: print,
    feedback: FeedbackMarkup()
  });

  render(
    <Provider store={store}>
      <TopNav />
    </Provider>,
    document.getElementById('nav')
  );

  render(
    <Provider store={store}>
      <Footer />
    </Provider>,
    document.getElementById('footer')
  );

  _loadData(store, nodeId, year);
};

export const unmount = () => {
  unmountComponentAtNode(document.querySelector('.js-top-municipalities'));
  unmountComponentAtNode(document.querySelector('.js-top-municipalities-map'));
  unmountComponentAtNode(document.querySelector('.js-top-municipalities-title-container'));
  unmountComponentAtNode(document.querySelector('.js-source-legend'));
  unmountComponentAtNode(document.querySelector('.js-destination-legend'));
  unmountComponentAtNode(document.querySelector('.js-top-destination'));
  unmountComponentAtNode(document.getElementById('year-dropdown'));
  unmountComponentAtNode(document.querySelector('.js-top-destination-map'));
  unmountComponentAtNode(document.querySelector('.js-sustainability-table'));
  unmountComponentAtNode(document.querySelector('.js-scatterplot-container'));
  unmountComponentAtNode(document.getElementById('zero-deforestation-tooltip'));
  unmountComponentAtNode(document.getElementById('forest-500-tooltip'));
  unmountComponentAtNode(document.getElementById('year-dropdown'));
  unmountComponentAtNode(document.getElementById('nav'));
  unmountComponentAtNode(document.getElementById('footer'));
};
