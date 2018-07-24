/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import get from 'lodash/get';
import capitalize from 'lodash/capitalize';
import withWidget from 'react-components/widgets/with-widget.hoc';
import HelpTooltip from 'react-components/shared/help-tooltip.component';
import TitleGroup from 'react-components/profile-node/title-group.component';

function ActorSummary(props) {
  const {
    name,
    type,
    year,
    summary,
    country,
    tooltips,
    printMode,
    forest_500,
    zero_deforestation
  } = props;

  const titles = [
    { name, label: capitalize(type) },
    { name: country, label: 'Country' },
    { name: 'Soy', label: 'Commodity' },
    {
      dropdown: true,
      label: 'Year',
      value: year,
      valueList: [2010, 2011, 2012, 2013, 2014, 2015],
      onValueSelected: console.log
    }
  ];

  return (
    <div className="c-overall-info">
      <div className="row">
        <div className="small-12 columns">
          <TitleGroup titles={titles} />
        </div>
        <div className="small-12 columns">
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
            {zero_deforestation === 'YES' ? (
              <div className="value">
                <svg className="icon icon-check">
                  <use xlinkHref="#icon-check-circle" />
                </svg>
                Yes
              </div>
            ) : (
              <div className="value">
                <svg className="icon icon-no">
                  <use xlinkHref="#icon-no-circle" />
                </svg>
                No
              </div>
            )}
          </div>
          <div className="stat-item">
            <div className="legend">
              FOREST 500 SCORE
              <span id="forest-500-tooltip">
                <HelpTooltip text={get(tooltips, 'profileNode.forest500Score')} position="bottom" />
              </span>
            </div>
            <div className="value forest-500-score">
              {Array.from({ length: 5 }).map((_, index) => (
                <svg className="icon circle-icon">
                  <use xlinkHref={`#icon-circle-${forest_500 > index ? 'filled' : 'empty'}`} />
                </svg>
              ))}
            </div>
          </div>
        </div>
        <div
          className={cx('small-12', 'columns', { 'large-12': printMode, 'large-7': !printMode })}
        >
          <p className="summary">{summary || '-'}</p>
        </div>
      </div>
    </div>
  );
}

ActorSummary.propTypes = {
  name: PropTypes.string,
  type: PropTypes.string,
  year: PropTypes.number,
  summary: PropTypes.string,
  country: PropTypes.string,
  tooltips: PropTypes.object,
  printMode: PropTypes.bool,
  forest_500: PropTypes.number,
  zero_deforestation: PropTypes.string
};

export default withWidget(ActorSummary);
