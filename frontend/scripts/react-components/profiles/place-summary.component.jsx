/* eslint-disable camelcase,react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import capitalize from 'lodash/capitalize';
import HelpTooltip from 'react-components/shared/help-tooltip/help-tooltip.component';
import TitleGroup from 'react-components/profiles/title-group';
import SummaryTitle from 'react-components/profiles/summary-title.component';
import Map from 'react-components/profiles/map.component';
import Text from 'react-components/shared/text';
import formatValue from 'utils/formatValue';

function PlaceSummary(props) {
  const {
    year,
    tooltips,
    onYearChange,
    context,
    openModal,
    data: {
      countryName,
      jurisdiction1GeoId,
      summary,
      area,
      commodityProduction,
      commodityArea,
      jurisdictionName,
      jurisdictionGeoId,
      jurisdiction1: stateName,
      jurisdiction2: biomeName
    } = {},
    profileMetadata: { mainTopojsonPath, mainTopojsonRoot } = {}
  } = props;

  const { commodityName } = context;
  const titles = [
    { name: commodityName, label: 'Commodity' },
    {
      dropdown: true,
      label: 'Year',
      value: { label: `${year}`, value: year },
      options: (context.years
        ? context.years.map(_year => ({ label: `${_year}`, value: _year }))
        : []
      ).sort((a, b) => b.value - a.value),
      onYearChange
    },
    { name: capitalize(countryName), label: 'Country' },
    { name: capitalize(biomeName), label: 'Biome' },
    { name: capitalize(stateName), label: 'State' }
  ];
  const commodityAreaValue = formatValue(commodityArea, 'area');
  const areaValue = formatValue(area, 'area');
  const commodityProductionValue = formatValue(commodityProduction, 'tons');

  const renderMunicipalityMap = () => (
    <div className="c-overall-info page-break-inside-avoid">
      <div className="c-locator-map map-municipality-banner">
        {countryName && (
          <Map
            topoJSONPath={`./vector_layers${mainTopojsonPath.replace(
              '$stateGeoId$',
              jurisdiction1GeoId
            )}`}
            topoJSONRoot={mainTopojsonRoot.replace('$stateGeoId$', jurisdiction1GeoId)}
            getPolygonClassName={d =>
              d.properties.geoid === jurisdictionGeoId ? '-isCurrent' : ''
            }
          />
        )}
      </div>
    </div>
  );

  const renderStats = () =>
    console.log(areaValue, commodityAreaValue, commodityProductionValue) ||
    ((areaValue !== '-' || commodityAreaValue !== '-' || commodityProductionValue !== '-') && (
      <div className="small-12">
        {areaValue !== '-' && (
          <div className="stat-item">
            <Text variant="mono" color="grey-faded" transform="uppercase" className="legend">
              Area
            </Text>
            <Text as="span" variant="mono" size="lg" weight="bold">
              {areaValue}
            </Text>
            <Text as="span" variant="mono" size="lg" weight="bold">
              {' '}
              km<sup>2</sup>
            </Text>
          </div>
        )}
        {commodityAreaValue !== '-' && (
          <div className="stat-item">
            <Text variant="mono" color="grey-faded" transform="uppercase" className="legend">
              {commodityName} land
              <HelpTooltip text={get(tooltips, 'profileNode.soyLand')} position="bottom" />
            </Text>
            <Text as="span" variant="mono" size="lg" weight="bold">
              {commodityAreaValue}
            </Text>
            <Text as="span" variant="mono" size="lg" weight="bold">
              {' '}
              ha
            </Text>
          </div>
        )}
        {commodityProductionValue !== '-' && (
          <div className="stat-item">
            <Text variant="mono" color="grey-faded" transform="uppercase" className="legend">
              Soy production
              <HelpTooltip
                text={get(tooltips, 'profileNode.commodityProduction')}
                position="bottom"
              />
            </Text>
            <Text as="span" variant="mono" size="lg" weight="bold">
              {commodityProductionValue}
            </Text>
            <Text as="span" variant="mono" size="lg" weight="bold">
              {' '}
              t
            </Text>
          </div>
        )}
      </div>
    ));

  return (
    <React.Fragment>
      <div className="c-overall-info page-break-inside-avoid">
        <div className="row">
          <div className="small-12 medium-9 columns">
            <SummaryTitle name={jurisdictionName} openModal={openModal} />
            <TitleGroup titles={titles} on={onYearChange} />
            {renderStats()}
          </div>
          <div className="small-12 medium-3 columns">{renderMunicipalityMap()}</div>
        </div>
        <div className="row">
          <div className="small-12 columns">
            <Text
              variant="serif"
              size="md"
              weigth="light"
              lineHeight="lg"
              color="grey"
              className="summary"
              dangerouslySetInnerHTML={{ __html: summary }}
            />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

PlaceSummary.propTypes = {
  year: PropTypes.number,
  data: PropTypes.object,
  context: PropTypes.object,
  tooltips: PropTypes.object,
  onYearChange: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
  profileMetadata: PropTypes.object.isRequired
};

export default PlaceSummary;
