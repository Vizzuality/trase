/* eslint-disable camelcase,react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import get from 'lodash/get';
import capitalize from 'lodash/capitalize';
import HelpTooltip from 'react-components/shared/help-tooltip/help-tooltip.component';
import TitleGroup from 'react-components/profiles/title-group.component';

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
      { name: nodeName, label: capitalize(columnName) },
      { name: countryName, label: 'Country' },
      { name: commodityName, label: 'Commodity' },
      {
        dropdown: true,
        label: 'Year',
        value: year,
        valueList: (context.years ? [...context.years] : []).sort((a, b) => b - a),
        onValueSelected: onYearChange
      }
    ];
    return (
      <div className="c-overall-info" data-test="actor-summary">
        <div className="row">
          <div className="small-12 columns">
            <TitleGroup titles={titles} on={onYearChange} />
          </div>
          <div className="small-12 columns">
            {typeof zeroDeforestation !== 'undefined' && (
              <div className="stat-item zero-deforestation-commitment js-zero-deforestation-commitment">
                <div className="legend">
                  ZERO DEFORESTATION COMMITMENT
                  <span>
                    <HelpTooltip
                      text={get(tooltips, 'profileNode.zeroDeforestationCommitment')}
                      position="bottom"
                    />
                  </span>
                </div>
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
            {typeof forest500 !== 'undefined' && (
              <div className="stat-item">
                <div className="legend">
                  FOREST 500 SCORE
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
          </div>
          <div
            className={cx('small-12', 'columns', { 'large-12': printMode, 'large-7': !printMode })}
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
