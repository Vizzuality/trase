import ProfileActorMarkup from 'html/profile-actor.ejs';
import NavMarkup from 'html/includes/_nav.ejs';
import FooterMarkup from 'html/includes/_footer.ejs';
import FeedbackMarkup from 'html/includes/_feedback.ejs';


import 'styles/_base.scss';
import 'styles/_texts.scss';
import 'styles/_foundation.css';
import 'styles/layouts/l-profile-actor.scss';
import 'styles/components/shared/button.scss';
import 'styles/components/shared/spinner.scss';
import 'styles/components/shared/nav.scss';
import 'styles/components/shared/_footer.scss';
import 'styles/components/profiles/area-select.scss';
import 'styles/components/profiles/map.scss';
import 'styles/components/profiles/overall-info.scss';
import 'styles/components/profiles/info.scss';
import 'styles/components/profiles/link-buttons.scss';
import 'styles/components/profiles/error.scss';
import 'styles/components/shared/tabs.scss';

import Nav from 'components/shared/nav.component.js';
import Dropdown from 'components/shared/dropdown.component';
import Map from 'components/profiles/map.component';
import Line from 'components/profiles/line.component';
import MultiTable from 'components/profiles/multi-table.component';
import Scatterplot from 'components/profiles/scatterplot.component';
import Tooltip from 'components/shared/info-tooltip.component';
import choroLegend from 'components/profiles/choro-legend.component';

import qs from 'query-string';
import smoothScroll from 'utils/smoothScroll';
import formatApostrophe from 'utils/formatApostrophe';
import formatValue from 'utils/formatValue';
import swapProfileYear from 'utils/swapProfileYear';
import capitalize from 'lodash/capitalize';
import { getURLFromParams, GET_ACTOR_FACTSHEET } from '../utils/getURLFromParams';
import { ACTORS_TOP_SOURCES_SWITCHERS_BLACKLIST } from 'constants';
import TopSourceTemplate from 'templates/profiles/top-source-switcher.ejs';
import EventManager from 'utils/eventManager';

const evManager = new EventManager();

const defaults = {
  country: 'Brazil',
  commodity: 'soy'
};

let print = false;

const tooltip = new Tooltip('.js-infowindow');
const LINE_MARGINS = { top: 10, right: 100, bottom: 25, left: 50 };
let year;
let lineSettings;

const _initSource = (selectedSource, data) => {
  if (data.top_sources === undefined) {
    return;
  }

  const sourceLines = Object.assign({}, data.top_sources[selectedSource]);

  sourceLines.lines = sourceLines.lines.slice(0, 5);

  new Line(
    '.js-top-municipalities',
    sourceLines,
    data.top_sources.included_years,
    Object.assign({}, lineSettings, {
      margin: LINE_MARGINS,
      height: 244
    })
  );

  document.querySelector('.js-top-municipalities-map').innerHTML = '';

  Map('.js-top-municipalities-map', {
    topoJSONPath: `./vector_layers/${defaults.country.toUpperCase()}_${selectedSource.toUpperCase()}.topo.json`,
    topoJSONRoot: `${defaults.country.toUpperCase()}_${selectedSource.toUpperCase()}`,
    getPolygonClassName: ({ properties }) => {
      const source = data.top_sources[selectedSource].lines
        .find(s => (properties.geoid === s.geo_id));
      let value = 'n-a';
      if (source) value = source.value9 || 'n-a';
      return `-outline ch-${value}`;
    },
    showTooltipCallback: ({ properties }, x, y) => {
      const source = data.top_sources[selectedSource].lines
        .find(s => (properties.geoid === s.geo_id));
      const title = `${data.node_name} > ${properties.nome.toUpperCase()}`;

      if (source) {
        tooltip.show(x, y,
          title,
          [{
            title: 'Trade Volume',
            value: formatValue(source.values[0], 'Trade volume'),
            unit: 'Tons'
          }]
        );
      }

    },
    hideTooltipCallback: () => {
      tooltip.hide();
    }
  });
};

const _build = (data, nodeId) => {
  const verb = (data.column_name === 'EXPORTER') ? 'exported' : 'imported';
  const verbGerund = (data.column_name === 'EXPORTER') ? 'exporting' : 'importing';

  lineSettings = {
    margin: { top: 10, right: 100, bottom: 30, left: 94 },
    height: 244,
    ticks: {
      yTicks: 6,
      yTickPadding: 10,
      yTickFormatType: 'top-location',
      xTickPadding: 15
    },
    showTooltipCallback: (location, x, y) => {
      tooltip.show(x, y,
        `${location.name.toUpperCase()} > ${data.node_name}, ${location.date.getFullYear()}`,
        [
          { title: 'Trade volume',
            value: formatValue(location.value, 'Trade volume'),
            unit: 'Tons'
          }
        ]
      );
    },
    hideTooltipCallback: () => {
      tooltip.hide();
    },
    lineClassNameCallback: (lineData, lineDefaultStyle) => {
      return `${lineDefaultStyle} line-${lineData[0].value9}`;
    }
  };

  if (data.top_sources && data.top_sources.municipality.lines.length) {
    _setTopSourceSwitcher(data, verb);

    choroLegend(null, '.js-source-legend', {
      title: [`Soy ${verb} in ${year}`, '(tonnes)'],
      bucket: [[data.top_sources.buckets[0], ...data.top_sources.buckets]]
    });

    _initSource((print === true) ? 'state' : 'municipality', data);
  }


  if (data.top_countries && data.top_countries.lines.length) {
    document.querySelector('.js-top-map-title').textContent = `Top destination countries of Soy ${verb} by ${capitalize(data.node_name)} in ${year}`;

    choroLegend(null, '.js-destination-legend', {
      title: [`Soy ${verb} in ${year}`, '(tonnes)'],
      bucket: [[data.top_countries.buckets[0], ...data.top_countries.buckets]]
    });

    const topCountriesLines = Object.assign({}, data.top_countries);

    topCountriesLines.lines = topCountriesLines.lines.slice(0, 5);
    new Line(
      '.js-top-destination',
      topCountriesLines,
      data.top_countries.included_years,
      Object.assign({}, lineSettings, {
        showTooltipCallback: (location, x, y) => {
          tooltip.show(x, y,
            `${data.node_name} > ${location.name.toUpperCase()}, ${location.date.getFullYear()}`,
            [
              { title: 'Trade volume',
                value: formatValue(location.value, 'Trade volume'),
                unit: 'Tons'
              }
            ]
          );
        },
      }),
    );

    Map('.js-top-destination-map', {
      topoJSONPath: './vector_layers/WORLD.topo.json',
      topoJSONRoot: 'world',
      useRobinsonProjection: true,
      getPolygonClassName: ({ properties }) => {
        const country = data.top_countries.lines
          .find(c => (properties.iso2 === c.geo_id));
        let value = 'n-a';
        if (country) value = country.value9 || 'n-a';
        return `-outline ch-${value}`;
      },
      showTooltipCallback: ({ properties }, x, y) => {
        const country = data.top_countries.lines
          .find(c => (properties.name.toUpperCase() === c.name.toUpperCase()));
        const title = `${properties.name.toUpperCase()} > ${data.node_name}`;
        if (country)
        {
          tooltip.show(x, y,
            title,
            [{
              title: 'Trade Volume',
              value: formatValue(country.values[0], 'Trade volume'),
              unit: 'Tons'
            }]
          );
        }
      },
      hideTooltipCallback: () => {
        tooltip.hide();
      }
    });
  }

  if (data.sustainability && data.sustainability.length) {
    const tabsTitle = `Deforestation risk associated with ${formatApostrophe(data.node_name)} top sourcing regions in ${year}:`;

    new MultiTable({
      el: document.querySelector('.js-sustainability-table'),
      data: data.sustainability,
      tabsTitle,
      type: 't_head_actors',
      target: (item) => { return (item.name === 'Municipalities') ? 'place' : null; },
      year
    });
  }

  if (data.companies_sourcing) {
    document.querySelector('.js-companies-exporting-y-axis').innerHTML = `${data.companies_sourcing.dimension_y.name} (${data.companies_sourcing.dimension_y.unit})`;

    new Scatterplot('.js-companies-exporting', {
      data: data.companies_sourcing.companies,
      xDimension: data.companies_sourcing.dimensions_x,
      node: { id: nodeId, name: data.node_name },
      verbGerund,
      year,
      showTooltipCallback: (company, indicator, x, y) => {
        tooltip.show(x, y,
          company.name,
          [
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
          ]
        );
      },
      hideTooltipCallback: () => {
        tooltip.hide();
      }
    });
  }
};

const _setInfo = (info, nodeId) => {
  document.querySelector('.js-name').textContent = info.name ? capitalize(info.name) : '-';
  document.querySelector('.js-link-button-name').textContent = formatApostrophe(capitalize(info.name)) + ' PROFILE';
  document.querySelector('.js-legend').textContent = info.type || '-';
  document.querySelector('.js-country').textContent = info.country ? capitalize(info.country) : '-';
  if (info.forest_500 > 0) document.querySelector('.js-forest-500-score .circle-icon[data-value="1"] use').setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#icon-circle-filled');
  if (info.forest_500 > 1) document.querySelector('.js-forest-500-score .circle-icon[data-value="2"] use').setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#icon-circle-filled');
  if (info.forest_500 > 2) document.querySelector('.js-forest-500-score .circle-icon[data-value="3"] use').setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#icon-circle-filled');
  if (info.forest_500 > 3) document.querySelector('.js-forest-500-score .circle-icon[data-value="4"] use').setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#icon-circle-filled');
  if (info.forest_500 > 4) document.querySelector('.js-forest-500-score .circle-icon[data-value="5"] use').setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#icon-circle-filled');
  if (info.zero_deforestation === 'YES') {
    document.querySelector('.js-zero-deforestation-commitment [data-value="yes"]').classList.remove('is-hidden');
  } else {
    document.querySelector('.js-zero-deforestation-commitment [data-value="no"]').classList.remove('is-hidden');
  }
  document.querySelector('.js-link-map').setAttribute('href', `./flows?selectedNodesIds=[${nodeId}]&isMapVisible=true&isMapVisible=true&selectedYears=[${year},${year}]`);
  document.querySelector('.js-link-supply-chain').setAttribute('href', `./flows?selectedNodesIds=[${nodeId}]&isMapVisible=true&selectedYears=[${year},${year}]`);
  document.querySelector('.js-summary-text').textContent = info.summary ? info.summary : '-';
};

const _setEventListeners = () => {
  smoothScroll(document.querySelectorAll('.js-link-profile'));
};

const _showErrorMessage = (message = null) => {
  const el = document.querySelector('.l-profile-actor');
  el.classList.add('-error');
  document.querySelector('.js-loading').classList.add('is-hidden');
  el.querySelector('.js-wrap').classList.add('is-hidden');
  el.querySelector('.js-error-message').classList.remove('is-hidden');
  if (message !== null) {
    el.querySelector('.js-message').innerHTML = message;
  }
};

const _setTopSourceSwitcher = (data, verb) => {
  const template = TopSourceTemplate({
    year,
    verb,
    nodeName: capitalize(data.node_name),
    switchers: Object.keys(data.top_sources).filter(key => !(ACTORS_TOP_SOURCES_SWITCHERS_BLACKLIST.includes(key)))
  });
  document.querySelector('.js-top-municipalities-title').innerHTML = template;

  const switchers = Array.prototype.slice.call(document.querySelectorAll('.js-top-source-switcher'), 0);
  switchers.forEach(switcher => {
    evManager.addEventListener(switcher, 'click', (e) => _switchTopSource(e, data));
  });
};

const _switchTopSource = (e, data) => {
  const selectedSwitch = e && e.currentTarget;
  if (!selectedSwitch) {
    return;
  }

  const selectedSource = selectedSwitch.getAttribute('data-key');
  const switchers = Array.prototype.slice.call(document.querySelectorAll('.js-top-source-switcher'), 0);
  switchers.forEach(switcher => {
    switcher.classList.remove('selected');
  });
  selectedSwitch.classList.add('selected');

  _initSource(selectedSource, data);
};

export const mount = (root)  => {
  root.innerHTML = ProfileActorMarkup({
    nav: NavMarkup({ page: 'profile-actor' }),
    footer: FooterMarkup(),
    feedback: FeedbackMarkup()
  });
  const url = window.location.search;
  const urlParams = qs.parse(url);
  const nodeId = urlParams.nodeId;
  year = urlParams.year || 2015;

  const actorFactsheetURL = getURLFromParams(GET_ACTOR_FACTSHEET, { context_id: 1, node_id: nodeId, year });

  fetch(actorFactsheetURL)
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
        type: data.column_name,
        name: data.node_name,
        country: data.country_name,
        forest_500: data.forest_500,
        zero_deforestation: data.zero_deforestation,
        summary: data.summary
      };

      _setInfo(info, nodeId);
      _setEventListeners();

      const yearDropdown = new Dropdown('year', year => {
        yearDropdown.setTitle(year);
        swapProfileYear(year);
      });
      yearDropdown.setTitle(year);

      _build(data, nodeId);
    })
    .catch((reason) => _showErrorMessage(reason.message));

  const nav = new Nav();
  print = nav.print;
};
