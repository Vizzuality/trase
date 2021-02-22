/* eslint-disable camelcase,react/no-danger */
import React from 'react';
import Sticky from 'react-stickynode';
import cx from 'classnames';

import PropTypes from 'prop-types';
import capitalize from 'lodash/capitalize';
import HelpTooltip from 'react-components/shared/help-tooltip/help-tooltip.component';
import TitleGroup from 'react-components/profile/profile-components/title-group';
import SummaryTitle from 'react-components/profile/profile-components/summary/summary-title.component';
import Map from 'react-components/profile/profile-components/map.component';
import Text from 'react-components/shared/text';
import formatValue from 'utils/formatValue';

function PlaceSummary(props) {
  const {
    year,
    onChange,
    context,
    openModal,
    data: {
      countryName,
      jurisdiction1GeoId,
      summary,
      jurisdictionName,
      jurisdictionGeoId,
      jurisdiction1: jurisdiction1Name,
      jurisdiction1Label,
      jurisdiction2: jurisdiction2Name,
      jurisdiction2Label,
      headerAttributes
    } = {},
    profileMetadata: { mainTopojsonPath, mainTopojsonRoot, years } = {}
  } = props;

  const { commodityName } = context;
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
    { name: capitalize(jurisdiction2Name), label: jurisdiction2Label || 'Biome' },
    { name: capitalize(jurisdiction1Name), label: jurisdiction1Label || 'State' }
  ];

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
  profileMetadata: PropTypes.object.isRequired
};

export default PlaceSummary;
