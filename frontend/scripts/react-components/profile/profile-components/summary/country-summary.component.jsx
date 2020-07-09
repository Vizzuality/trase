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
import Icon from 'react-components/shared/icon';

function CountrySummary(props) {
  const {
    year,
    onChange,
    printMode,
    openModal,
    profileMetadata: {
      years,
      activity,
      commodities,
      activities,
      commodityId,
      name: countryName
    } = {},
    data: { summary, headerAttributes } = {}
  } = props;

  const renderCountryMap = () => (
    <div className="c-overall-info page-break-inside-avoid">
      <div className="c-locator-map map-country-banner">
        <Map
          topoJSONPath="./vector_layers/WORLD.topo.json"
          topoJSONRoot="world"
          getPolygonClassName={d =>
            d.properties.name.toLowerCase() === countryName.toLowerCase() ? '-isCurrent' : ''
          }
          useRobinsonProjection
        />
      </div>
    </div>
  );

  const renderForest500 = ({ name, tooltip, value }) => (
    <div className="stat-item">
      <div className="legend">
        <Text transform="uppercase" variant="mono" as="span">
          {name}
        </Text>
        <span id="forest-500-tooltip">
          <HelpTooltip text={tooltip} />
        </span>
      </div>
      <div className="value forest-500-score">
        {Array.from({ length: 5 }).map((_, index) => (
          <Icon
            key={`circle${index}`}
            color="grey"
            className="circle-icon"
            icon={`icon-circle-${value > index ? 'filled' : 'empty'}`}
          />
        ))}
      </div>
    </div>
  );

  const renderZeroDeforestation = ({ name, tooltip, value }) => (
    <div className="stat-item">
      <Text transform="uppercase" variant="mono" as="div" className="legend">
        {name}
        <span>
          <HelpTooltip text={tooltip} />
        </span>
      </Text>
      {value.toLowerCase() !== 'none' ? (
        <div className="value">
          <Icon color="grey" icon="icon-check-circle" className="icon-check-circle" />
          <Text
            transform="uppercase"
            variant="mono"
            as="span"
            weight="bold"
            size="lg"
            className="stats-text"
          >
            {value}
          </Text>
        </div>
      ) : (
        <div className="value">
          <Icon color="grey" icon="icon-no-circle" className="icon-no" />
          <Text transform="uppercase" variant="mono" as="span" weight="bold" className="stats-text">
            NONE
          </Text>
        </div>
      )}
    </div>
  );

  const selectedCommodity = commodities.find(c => c.id === commodityId);
  const selectedActivity = activities.find(a => a.name === activity);
  const titles = [
    {
      dropdown: true,
      label: 'Activity',
      value: { label: capitalize(activity), value: selectedActivity.id },
      options: activities
        .map(c => ({ label: capitalize(c.name.toLowerCase()), value: c.id }))
        .sort((a, b) => b.value - a.value),
      onChange: nodeId => onChange('activityInfo', { nodeId, commodityId, activity })
    },
    {
      dropdown: true,
      label: 'Commodity',
      value: {
        label: capitalize(selectedCommodity.name.toLowerCase()),
        value: commodityId
      },
      options: commodities
        .map(c => ({ label: capitalize(c.name.toLowerCase()), value: c.id }))
        .sort((a, b) => b.value - a.value),
      onChange: newCommodityId => onChange('commodity', newCommodityId)
    },
    {
      dropdown: true,
      label: 'Year',
      value: { label: `${year}`, value: year },
      options: (years ? years.map(_year => ({ label: `${_year}`, value: _year })) : []).sort(
        (a, b) => b.value - a.value
      ),
      onChange: newYear => onChange('year', newYear)
    }
  ];

  const renderIndicator = indicatorKey => {
    if (indicatorKey === 'forest_500') {
      return renderForest500(headerAttributes.forest_500);
    }
    if (indicatorKey === 'zero_deforestation') {
      return renderZeroDeforestation(headerAttributes.zero_deforestation);
    }
    const { name, value, unit, tooltip } = headerAttributes[indicatorKey];
    if (!value) return null;
    return (
      <div className="stat-item" key={`${indicatorKey}${name}`}>
        <Text transform="uppercase" variant="mono" as="div" className="legend">
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
  };

  return (
    <div
      id="overall-info"
      className="c-overall-info page-break-inside-avoid"
      data-test="country-summary"
    >
      <div className="row">
        <div className="small-12 show-for-small profile-map-mobile">{renderCountryMap()}</div>
        <div className="small-12 medium-7 columns">
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
                  name={countryName}
                  activity={activity}
                  openModal={openModal}
                />
                <TitleGroup
                  sticky={status === Sticky.STATUS_FIXED}
                  titles={titles}
                  on={newYear => onChange('year', newYear)}
                />
                {status !== Sticky.STATUS_FIXED &&
                  headerAttributes &&
                  Object.keys(headerAttributes).length > 0 &&
                  Object.keys(headerAttributes).some(k => headerAttributes[k].value !== null) && (
                    <div className="small-12">
                      {Object.keys(headerAttributes).map(indicatorKey =>
                        renderIndicator(indicatorKey)
                      )}
                    </div>
                  )}
              </div>
            )}
          </Sticky>
        </div>
        <div className="small-12 medium-5 columns hide-for-small">{renderCountryMap()}</div>
      </div>

      <div className="row">
        <div
          className={cx('small-12', 'columns', { 'large-12': printMode, 'large-10': !printMode })}
        >
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

CountrySummary.propTypes = {
  year: PropTypes.number,
  data: PropTypes.object,
  printMode: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
  profileMetadata: PropTypes.object.isRequired
};

export default CountrySummary;
