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
    onYearChange,
    openModal,
    profileMetadata: { years, activity } = {}
  } = props;

  const titles = [
    {
      dropdown: true,
      label: 'Activity',
      value: { label: capitalize(activity), value: activity },
      options: (activity ? [activity].map(o => ({ label: capitalize(o), value: o })) : []).sort(
        (a, b) => b.value - a.value
      ),
      function() {}
    },
    {
      dropdown: true,
      label: 'Commodity',
      value: { label: `${'Commodity'}`, value: 'Commodity' },
      options: (['Commodity'].map(o => ({ label: capitalize(o), value: o }))).sort(
        (a, b) => b.value - a.value
      ),
      function() {}
    },
    {
      dropdown: true,
      label: 'Year',
      value: { label: `${year}`, value: year },
      options: (years ? years.map(_year => ({ label: `${_year}`, value: _year })) : []).sort(
        (a, b) => b.value - a.value
      ),
      onYearChange
    },
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
                  on={onYearChange}
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
  onYearChange: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
  profileMetadata: PropTypes.object.isRequired
};

export default CountrySummary;
