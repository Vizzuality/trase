/* eslint-disable no-new */
import Tooltip from 'components/shared/info-tooltip.component';
import { ACTORS_TOP_SOURCES_SWITCHERS_BLACKLIST, DEFAULT_PROFILE_PAGE_YEAR } from 'constants';
import FeedbackMarkup from 'html/includes/_feedback.ejs';
import ProfileActorMarkup from 'html/profile-actor.ejs';
import get from 'lodash/get';
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
import addApostrophe from 'utils/addApostrophe';
import formatValue from 'utils/formatValue';
import { GET_ACTOR_FACTSHEET_URL, getURLFromParams } from 'utils/getURLFromParams';
import { translateNode, translateText } from 'utils/transifex';

import smoothScroll from 'utils/smoothScroll';
import { getDefaultContext } from 'scripts/reducers/helpers/contextHelper';

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

const _initSource = (selectedSource, data, year, onLinkClick, store) => {
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
        data={sourceLines}
        xValues={data.top_sources.included_years}
        settings={settings}
        useBottomLegend
        targetLink="profilePlace"
        onLinkClick={onLinkClick}
        year={year}
      />
    </Provider>,
    document.querySelector('.js-top-municipalities-chart')
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
    const title = `${data.node_name} > ${properties.name.toUpperCase()}`;

    if (source) {
      tooltip.show(x, y, title, [
        {
          title: 'Trade Volume',
          value: formatValue(source.values[year - 2010], 'Trade volume'),
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

const _setTopSourceSwitcher = (data, verb, year, onLinkClick, store) => {
  const nodeName = capitalize(data.node_name);
  const items = Object.keys(data.top_sources).filter(
    key => !ACTORS_TOP_SOURCES_SWITCHERS_BLACKLIST.includes(key)
  );

  const title = (
    <span>
      Top sourcing regions of Soy {verb} by <span className="notranslate">{nodeName}</span> in{' '}
      <span className="notranslate">{year}</span>:
    </span>
  );

  document.querySelector('.js-top-municipalities').classList.remove('is-hidden');

  render(
    <Provider store={store}>
      <DropdownTabSwitcher
        title={title}
        items={items}
        onSelectedIndexChange={index => _initSource(items[index], data, year, onLinkClick, store)}
      />
    </Provider>,
    document.querySelector('.js-top-municipalities-title-container')
  );
};

const _build = (data, { nodeId, year, print }, onLinkClick, store) => {
  const verb = data.column_name === 'EXPORTER' ? 'exported' : 'imported';
  const verbGerund = data.column_name === 'EXPORTER' ? 'exporting' : 'importing';
  const { tooltips } = store.getState().app;

  render(
    <HelpTooltip
      text={get(tooltips, 'profileActor.zeroDeforestationCommitment')}
      position="bottom"
    />,
    document.getElementById('zero-deforestation-tooltip')
  );
  render(
    <HelpTooltip text={get(tooltips, 'profileActor.forest500Score')} position="bottom" />,
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
    lineClassNameCallback: (lineIndex, lineDefaultStyle) => `${lineDefaultStyle} line-${lineIndex}`
  };

  if (data.top_sources && data.top_sources.municipality.lines.length) {
    _setTopSourceSwitcher(data, verb, year, onLinkClick, store);

    render(
      <Provider store={store}>
        <ChoroLegend
          title={[`Soy ${verb} in ${year}`, '(tonnes)']}
          bucket={[[data.top_sources.buckets[0], ...data.top_sources.buckets]]}
        />
      </Provider>,
      document.querySelector('.js-source-legend')
    );

    _initSource(print ? 'state' : 'municipality', data, year, onLinkClick, store);
  }

  const nameSpan = document.createElement('span');
  nameSpan.classList.add('notranslate');
  nameSpan.textContent = capitalize(data.node_name);

  const yearSpan = document.createElement('span');
  yearSpan.classList.add('notranslate');
  yearSpan.textContent = year;

  if (data.top_countries && data.top_countries.lines.length) {
    document.querySelector('.js-top-map').classList.remove('is-hidden');

    const titleNode = document.querySelector('.js-top-map-title');

    titleNode.innerHTML = '';
    titleNode.appendChild(document.createTextNode(`Top destination countries of Soy ${verb} by `));
    titleNode.appendChild(nameSpan);
    titleNode.appendChild(document.createTextNode(' in '));
    titleNode.appendChild(yearSpan);
    translateNode(titleNode);

    render(
      <Provider store={store}>
        <ChoroLegend
          title={[translateText(`Soy ${verb} in ${year}`), translateText('(tonnes)')]}
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
          data={topCountriesLines}
          xValues={data.top_countries.included_years}
          settings={settings}
          useBottomLegend
        />
      </Provider>,
      document.querySelector('.js-top-destination-chart')
    );

    const getPolygonClassName = ({ properties }) => {
      const country = data.top_countries.lines.find(c => properties.iso2 === c.geo_id);
      let value = 'n-a';
      if (country) value = typeof country.value9 !== 'undefined' ? country.value9 : 'n-a';
      return `-outline ch-${value}`;
    };
    const showTooltipCallback = ({ properties }, x, y) => {
      const country = data.top_countries.lines.find(c => properties.iso2 === c.geo_id);
      if (country) {
        const title = `${country.name.toUpperCase()} > ${data.node_name}`;
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
    const filteredData = data.sustainability.filter(elem => elem.rows.length > 0);
    if (filteredData.length !== 0) {
      const title = (
        <span>
          Deforestation risk associated with <span className="notranslate">{data.node_name}</span>
          {addApostrophe(data.node_name)} top sourcing regions in{' '}
          <span className="notranslate">{year}</span>:
        </span>
      );

      translateText(title);

      document.querySelector('.js-area-table').classList.remove('is-hidden');

      render(
        <Provider store={store}>
          <MultiTable
            id="sustainability"
            data={filteredData}
            tabsTitle={title}
            tabsTitleTooltip={get(tooltips, 'profileActor.deforestationRisk')}
            type="t_head_actors"
            target={item => (item.name === 'Municipalities' ? 'profilePlace' : null)}
            year={year}
          />
        </Provider>,
        document.querySelector('.js-sustainability-table')
      );
    }
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
    const scatterplotXDimensions = data.companies_sourcing.dimensions_x.slice(0, 3);
    const scatterplots = print
      ? scatterplotXDimensions.map(xDimension => ({
          title: <span data-unit={xDimension.unit}>{xDimension.name}</span>
        }))
      : [{ title: scatterplotTitle }];

    render(
      <Provider store={store}>
        <div>
          {print && <h3 className="title">{scatterplotTitle}</h3>}
          {scatterplots.map((plot, index) => (
            <Scatterplot
              key={index}
              width={scatterplotContainerElement.clientWidth}
              title={plot.title}
              data={data.companies_sourcing.companies}
              xDimension={scatterplotXDimensions}
              xDimensionSelectedIndex={index}
              node={{ id: nodeId, name: data.node_name }}
              year={year}
              showTooltipCallback={showTooltipCallback}
              hideTooltipCallback={tooltip.hide}
            />
          ))}
        </div>
      </Provider>,
      scatterplotContainerElement
    );
  }
};

const _setInfo = (info, onLinkClick, { nodeId, year, contextId }) => {
  document.querySelector('.js-name').textContent = info.name ? capitalize(info.name) : '-';

  const nameSpan = document.createElement('span');
  nameSpan.classList.add('notranslate');
  nameSpan.textContent = capitalize(info.name);

  const linkButtonNode = document.querySelector('.js-link-button-name');
  linkButtonNode.innerHTML = '';
  linkButtonNode.appendChild(nameSpan);
  linkButtonNode.appendChild(document.createTextNode(`${addApostrophe(info.name)} PROFILE`));
  translateNode(linkButtonNode);

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
      state: {
        isMapVisible: true,
        selectedNodesIds: [parseInt(nodeId, 10)],
        expandedNodesIds: [parseInt(nodeId, 10)],
        selectedYears: [year, year],
        selectedContextId: contextId
      }
    })
  );

  document.querySelector('.js-link-supply-chain').addEventListener('click', () =>
    onLinkClick('tool', {
      state: {
        isMapVisible: false,
        selectedNodesIds: [parseInt(nodeId, 10)],
        expandedNodesIds: [parseInt(nodeId, 10)],
        selectedYears: [year, year],
        selectedContextId: contextId
      }
    })
  );
  document.querySelector('.js-summary-text').innerHTML = info.summary ? info.summary : '-';
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

const _switchYear = (store, nodeId, dropdownYear) => {
  setLoading();
  // eslint-disable-next-line no-use-before-define
  _loadData(store, nodeId, dropdownYear);
  store.dispatch({
    type: 'profileActor',
    payload: { query: { nodeId, year: dropdownYear } }
  });
};

const _loadData = (store, nodeId, year, print) => {
  const actorFactsheetURL = getURLFromParams(GET_ACTOR_FACTSHEET_URL, {
    context_id: 1,
    node_id: nodeId,
    year
  });
  setLoading();

  fetch(actorFactsheetURL)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(response => {
      if (!response) return;

      const data = response.data;

      // TODO: once we have this state in the reducer, move this logic to the exiting page title helper
      document.title = `TRASE - ${capitalize(
        data.node_name
      )} ${data.column_name.toLowerCase()} profile`;

      setLoading(false);

      const info = {
        type: data.column_name,
        name: data.node_name,
        country: data.country_name,
        forest_500: data.forest_500,
        zero_deforestation: data.zero_deforestation,
        summary: data.summary
      };

      _setInfo(info, onLinkClick(store), {
        nodeId,
        year,
        contextId: getDefaultContext(store.getState()).id
      });
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

      _build(data, { nodeId, year, print }, onLinkClick(store), store);
    })
    .catch(reason => {
      _showErrorMessage(reason.message);
      console.error(reason);
    });
};

export const mount = (root, store) => {
  const { query = {} } = store.getState().location;
  const { nodeId } = query;
  const print = query.print === 'true';
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

  _loadData(store, nodeId, year, print);
};

export const unmount = () => {
  unmountComponentAtNode(document.querySelector('.js-top-municipalities-chart'));
  unmountComponentAtNode(document.querySelector('.js-top-municipalities-map'));
  unmountComponentAtNode(document.querySelector('.js-top-municipalities-title-container'));
  unmountComponentAtNode(document.querySelector('.js-source-legend'));
  unmountComponentAtNode(document.querySelector('.js-destination-legend'));
  unmountComponentAtNode(document.querySelector('.js-top-destination-chart'));
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
