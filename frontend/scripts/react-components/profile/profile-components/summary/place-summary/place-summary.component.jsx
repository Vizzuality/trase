/* eslint-disable camelcase,react/no-danger */
import React, { useEffect } from 'react';
import Sticky from 'react-stickynode';
import cx from 'classnames';
import { CARTO_LAYERS, CARTO_GEOID_NAMES } from 'constants';

import PropTypes from 'prop-types';
import capitalize from 'lodash/capitalize';
import HelpTooltip from 'react-components/shared/help-tooltip/help-tooltip.component';
import TitleGroup from 'react-components/profile/profile-components/title-group';
import SummaryTitle from 'react-components/profile/profile-components/summary/summary-title.component';
import Map from 'react-components/profile/profile-components/map.component';
import VectorMap from 'react-components/profile/profile-components/vector-map/vector-map.component';
import Text from 'react-components/shared/text';
import formatValue from 'utils/formatValue';

function PlaceSummary(props) {
  const {
    year,
    onChange,
    context,
    openModal,
    countryLayers,
    data: {
      countryName,
      jurisdiction1GeoId,
      summary,
      jurisdictionName,
      jurisdictionGeoId,
      jurisdiction1Label,
      jurisdiction1: stateName,
      jurisdiction2: biomeName,
      headerAttributes,
      columnName
    } = {},
    profileMetadata: { mainTopojsonPath, mainTopojsonRoot, years } = {},
    getProfilePlaceBounds,
    placeBounds
  } = props;

  console.log(placeBounds);

  const { commodityName } = context;
  const parentVectorLayer =
    jurisdiction1Label &&
    columnName &&
    countryLayers?.find(l => l.id.endsWith(jurisdiction1Label.toLowerCase()));
  const vectorLayer =
    columnName && countryLayers?.find(l => l.id.endsWith(columnName.toLowerCase()));
  useEffect(() => {
    if (parentVectorLayer && stateName) {
      const parsedParentLayerId = CARTO_LAYERS[parentVectorLayer.id];
      if (parsedParentLayerId) {
        getProfilePlaceBounds(
          parsedParentLayerId,
          jurisdiction1GeoId,
          CARTO_GEOID_NAMES[parentVectorLayer.id]
        );
      } else {
        console.error('Missing parent layer carto layer id on the constants.js file');
      }
    }
  }, [parentVectorLayer, stateName]);
  const titles = [
    { name: commodityName, label: 'Commodity' },
    {
      dropdown: true,
      label: 'Year',
      value: { label: `${year}`, value: year },
      options: (years ? years.map(_year => ({ label: `${_year}`, value: _year })) : []).sort(
        (a, b) => b.value - a.value
      ),
      onChange: newYear => onChange('year', newYear)
    },
    { name: capitalize(countryName), label: 'Country' },
    { name: capitalize(biomeName), label: 'Biome' },
    { name: capitalize(stateName), label: 'State' }
  ];

  const renderMunicipalityMap = () => (
    <div className="c-overall-info page-break-inside-avoid">
      <div className="c-locator-map map-municipality-banner">
        {countryName &&
          (countryName === 'brazil' ? ( // We only have downloaded vector layers for brazil
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
          ) : (
            vectorLayer && <VectorMap vectorLayer={vectorLayer} geoId={jurisdictionGeoId} />
          ))}
      </div>
    </div>
  );

  const renderStats = () =>
    headerAttributes &&
    Object.keys(headerAttributes).length > 0 &&
    Object.keys(headerAttributes).some(k => headerAttributes[k].value !== null) && (
      <div className="small-12">
        {Object.keys(headerAttributes).map(indicatorKey => {
          const { name, value, unit, tooltip } = headerAttributes[indicatorKey];
          if (!value) return null;
          return (
            <div className="stat-item" key={indicatorKey}>
              <Text variant="mono" color="grey-faded" transform="uppercase" className="legend">
                {name}
                {tooltip && <HelpTooltip text={tooltip} />}
              </Text>
              <Text as="span" variant="mono" size="lg" weight="bold">
                {formatValue(value, indicatorKey)}
              </Text>
              <Text as="span" variant="mono" size="lg" weight="bold">
                {' '}
                {unit === 'km2' ? 'km²' : unit}
              </Text>
            </div>
          );
        })}
      </div>
    );

  return (
    <div
      id="overall-info"
      className="c-overall-info page-break-inside-avoid"
      data-test="place-summary"
    >
      <div className="row">
        <div className="small-12 show-for-small profile-map-mobile">{renderMunicipalityMap()}</div>
        <div className="small-12 medium-9 columns">
          <Sticky top={60} innerZ={85} activeClass="profile-sticky-group">
            {({ status }) => (
              <div
                className={cx({
                  'summary-sticky-group': true,
                  sticky: status === Sticky.STATUS_FIXED
                })}
              >
                <SummaryTitle
                  sticky={status === Sticky.STATUS_FIXED}
                  name={jurisdictionName}
                  openModal={openModal}
                />
                <TitleGroup sticky={status === Sticky.STATUS_FIXED} titles={titles} on={onChange} />
              </div>
            )}
          </Sticky>

          {renderStats()}
        </div>

        <div className="small-12 medium-3 columns hide-for-small">{renderMunicipalityMap()}</div>
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
  );
}

PlaceSummary.propTypes = {
  year: PropTypes.number,
  data: PropTypes.object,
  context: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
  profileMetadata: PropTypes.object.isRequired,
  getProfilePlaceBounds: PropTypes.func.isRequired,
  placeBounds: PropTypes.array,
  countryLayers: PropTypes.array
};

export default PlaceSummary;
