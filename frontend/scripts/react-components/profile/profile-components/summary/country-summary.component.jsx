/* eslint-disable camelcase,react/no-danger */
import React from 'react';
import Sticky from 'react-stickynode';
import cx from 'classnames';

import PropTypes from 'prop-types';
import capitalize from 'lodash/capitalize';
import TitleGroup from 'react-components/profile/profile-components/title-group';
import SummaryTitle from 'react-components/profile/profile-components/summary/summary-title.component';
import Text from 'react-components/shared/text';

function CountrySummary(props) {
  const {
    year,
    onChange,
    openModal,
    profileMetadata: { years, activity, commodities, activities, commodityId } = {}
  } = props;
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

  return (
    <div
      id="overall-info"
      className="c-overall-info page-break-inside-avoid"
      data-test="country-summary"
    >
      <div className="row">
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
                  name={`[CountryName] (${activity})`}
                  openModal={openModal}
                />
                <TitleGroup
                  sticky={status === Sticky.STATUS_FIXED}
                  titles={titles}
                  on={newYear => onChange('year', newYear)}
                />
              </div>
            )}
          </Sticky>
        </div>
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
            dangerouslySetInnerHTML={{ __html: 'summary' }}
          />
        </div>
      </div>
    </div>
  );
}

CountrySummary.propTypes = {
  year: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
  profileMetadata: PropTypes.object.isRequired
};

export default CountrySummary;
