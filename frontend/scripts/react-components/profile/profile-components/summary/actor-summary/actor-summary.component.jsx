/* eslint-disable camelcase,react/no-danger */
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Sticky from 'react-stickynode';
import SummaryTitle from 'react-components/profile/profile-components/summary/summary-title.component';
import HelpTooltip from 'react-components/shared/help-tooltip/help-tooltip.component';
import TitleGroup from 'react-components/profile/profile-components/title-group';
import Text from 'react-components/shared/text';
import Icon from 'react-components/shared/icon';
import formatValue from 'utils/formatValue';
import 'react-components/profile/profile-components/summary/summary.scss';

class ActorSummary extends React.PureComponent {
  render() {
    const {
      year,
      printMode,
      onChange,
      openModal,
      context,
      profileMetadata: { years },
      data: { nodeName, columnName, summary, headerAttributes } = {}
    } = this.props;
    const { commodityName, countryName } = context;
    const titles = [
      { name: columnName, label: 'Activity' },
      { name: commodityName, label: 'Commodity' },
      { name: countryName, label: 'Country' },
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
            <Text
              transform="uppercase"
              variant="mono"
              as="span"
              weight="bold"
              className="stats-text"
            >
              NONE
            </Text>
          </div>
        )}
      </div>
    );

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
      <div className="c-overall-info" data-test="actor-summary">
        <div className="row">
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
                    name={nodeName}
                    openModal={openModal}
                  />
                  <TitleGroup
                    sticky={status === Sticky.STATUS_FIXED}
                    titles={titles}
                    on={onChange}
                  />

                  {status !== Sticky.STATUS_FIXED &&
                    headerAttributes &&
                    Object.keys(headerAttributes).length > 0 &&
                    Object.keys(headerAttributes).some(k => headerAttributes[k].value !== null) && (
                      <div className="small-12">
                        {Object.keys(headerAttributes).map(indicatorKey => (
                          <Fragment key={indicatorKey}>{renderIndicator(indicatorKey)}</Fragment>
                        ))}
                      </div>
                    )}
                </div>
              )}
            </Sticky>
          </div>
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
}

ActorSummary.propTypes = {
  year: PropTypes.number,
  data: PropTypes.object,
  printMode: PropTypes.bool,
  context: PropTypes.object,
  profileMetadata: PropTypes.object,
  openModal: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired
};

export default ActorSummary;
