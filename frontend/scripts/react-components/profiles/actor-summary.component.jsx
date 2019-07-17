/* eslint-disable camelcase,react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import get from 'lodash/get';
import SummaryTitle from 'react-components/profiles/summary-title.component';
import HelpTooltip from 'react-components/shared/help-tooltip/help-tooltip.component';
import TitleGroup from 'react-components/profiles/title-group';
import Text from 'react-components/shared/text';
import Icon from 'react-components/shared/icon';
import 'react-components/profiles/summary.scss';

class ActorSummary extends React.PureComponent {
  render() {
    const {
      year,
      tooltips,
      printMode,
      onYearChange,
      openModal,
      context,
      profileMetadata: { availableYears },
      data: { nodeName, columnName, summary, forest500, zeroDeforestation } = {}
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
          <div className="small-12 columns">
            {typeof forest500 !== 'undefined' && (
              <div className="stat-item">
                <div className="legend">
                  <Text transform="uppercase" variant="mono" as="span">
                    Forest 500 score
                  </Text>
                  <span id="forest-500-tooltip">
                    <HelpTooltip
                      text={get(tooltips, 'profileNode.forest500Score')}
                      position="bottom"
                    />
                  </span>
                </div>
                <div className="value forest-500-score">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Icon
                      color="grey"
                      className="circle-icon"
                      key={`circle${index}`}
                      icon={`icon-circle-${forest500 > index ? 'filled' : 'empty'}`}
                    />
                  ))}
                </div>
              </div>
            )}
            {typeof zeroDeforestation !== 'undefined' && (
              <div className="stat-item">
                <Text transform="uppercase" variant="mono" as="div" className="legend">
                  ZERO DEFORESTATION COMMITMENT
                  <span>
                    <HelpTooltip
                      text={get(tooltips, 'profileNode.zeroDeforestationCommitment')}
                      position="bottom"
                    />
                  </span>
                </Text>
                {zeroDeforestation.toLowerCase() !== 'none' ? (
                  <div className="value">
                    <Icon color="grey" icon="icon-check-circle" className="icon-check-circle" />
                    <Text
                      transform="uppercase"
                      variant="mono"
                      as="span"
                      weight="bold"
                      className="stats-text"
                    >
                      {zeroDeforestation}
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
            )}
          </div>
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
  tooltips: PropTypes.object,
  context: PropTypes.object,
  profileMetadata: PropTypes.object,
  openModal: PropTypes.func.isRequired,
  onYearChange: PropTypes.func.isRequired
};

export default ActorSummary;
