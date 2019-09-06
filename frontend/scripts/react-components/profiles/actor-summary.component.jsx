/* eslint-disable camelcase,react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import SummaryTitle from 'react-components/profiles/summary-title.component';
import HelpTooltip from 'react-components/shared/help-tooltip/help-tooltip.component';
import TitleGroup from 'react-components/profiles/title-group';
import Text from 'react-components/shared/text';
import Icon from 'react-components/shared/icon';
import formatValue from 'utils/formatValue';
import 'react-components/profiles/summary.scss';

class ActorSummary extends React.PureComponent {
  render() {
    const {
      year,
      printMode,
      onYearChange,
      openModal,
      context,
      profileMetadata: { availableYears },
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
        options: (availableYears
          ? availableYears.map(_year => ({ label: `${_year}`, value: _year }))
          : []
        ).sort((a, b) => b.value - a.value),
        onYearChange
      }
    ];

    const renderForest500 = ({ name, tooltip, value }) => (
      <div className="stat-item">
        <div className="legend">
          <Text transform="uppercase" variant="mono" as="span">
            {name}
          </Text>
          <span id="forest-500-tooltip">
            <HelpTooltip text={tooltip} position="bottom" />
          </span>
        </div>
        <div className="value forest-500-score">
          {Array.from({ length: 5 }).map((_, index) => (
            <Icon
              color="grey"
              className="circle-icon"
              key={`circle${index}`}
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
            <HelpTooltip text={tooltip} position="bottom" />
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
        <div className="stat-item">
          <Text transform="uppercase" variant="mono" as="div" className="legend">
            {name}
            {tooltip && <HelpTooltip text={tooltip} position="bottom" />}
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
          <div className="small-12 columns">
            <SummaryTitle name={nodeName} openModal={openModal} />
          </div>
        </div>
        <div className="row">
          <div className="small-12 columns">
            <TitleGroup titles={titles} on={onYearChange} />
          </div>
          {headerAttributes &&
            Object.keys(headerAttributes).length > 0 &&
            Object.keys(headerAttributes).some(k => headerAttributes[k].value !== null) && (
              <div className="small-12 columns">
                {Object.keys(headerAttributes).map(indicatorKey => renderIndicator(indicatorKey))}
              </div>
            )}
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
  onYearChange: PropTypes.func.isRequired
};

export default ActorSummary;
