/* eslint-disable camelcase,react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import get from 'lodash/get';
import capitalize from 'lodash/capitalize';
import HelpTooltip from 'react-components/shared/help-tooltip/help-tooltip.component';
import TitleGroup from 'react-components/profiles/title-group';
import Text from 'react-components/shared/text';
import 'react-components/profiles/summary.scss';

class ActorSummary extends React.PureComponent {
  render() {
    const {
      year,
      tooltips,
      printMode,
      onYearChange,
      context,
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
        options: (context.years
          ? context.years.map(_year => ({ label: `${_year}`, value: _year }))
          : []
        ).sort((a, b) => b.value - a.value),
        onYearChange
      }
    ];
    return (
      <div className="c-overall-info" data-test="actor-summary">
        <div className="row">
          <div className="small-12 columns">
            <h2 className="profiles-title" data-test="profiles-title">
              {capitalize(nodeName)}
            </h2>
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
                  <Text transtorm="uppercase" variant="mono" as="span">
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
                    <svg className="icon circle-icon" key={`circle${index}`}>
                      <use xlinkHref={`#icon-circle-${forest500 > index ? 'filled' : 'empty'}`} />
                    </svg>
                  ))}
                </div>
              </div>
            )}
            {typeof zeroDeforestation !== 'undefined' && (
              <div className="stat-item">
                <Text transtorm="uppercase" variant="mono" as="div">
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
                    <svg className="icon icon-check">
                      <use xlinkHref="#icon-check-circle" />
                    </svg>
                    {zeroDeforestation}
                  </div>
                ) : (
                  <div className="value">
                    <svg className="icon icon-no">
                      <use xlinkHref="#icon-no-circle" />
                    </svg>
                    None
                  </div>
                )}
              </div>
            )}
          </div>
          <div
            className={cx('small-12', 'columns', { 'large-12': printMode, 'large-10': !printMode })}
          >
            <p className="summary" dangerouslySetInnerHTML={{ __html: summary }} />
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
  onYearChange: PropTypes.func.isRequired
};

export default ActorSummary;
