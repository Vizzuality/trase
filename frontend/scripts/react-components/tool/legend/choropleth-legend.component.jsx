import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import abbreviateNumber from 'utils/abbreviateNumber';
import Text from 'react-components/shared/text';
import ChoroArrow from './choro-arrow.component';

import 'react-components/tool/legend/choropleth-legend.scss';

function ChoroplethLegend(props) {
  const { highlightedChoroplethBucket, isBivariate, titles, colors, bucket } = props;
  return (
    <div className="c-choropleth-legend">
      <div
        className={cx('bucket-container', {
          '-bidimensional': isBivariate,
          '-horizontal': !isBivariate,
          '-wide': isBivariate && bucket[0].length >= 7
        })}
      >
        <div className="bucket-names">
          {titles.map(title => (
            <Text
              size="rg"
              color="gray"
              variant="sans"
              align="center"
              transform="uppercase"
              key={title}
              className="bucket-label"
            >
              {title}
            </Text>
          ))}
        </div>
        <ul className="bucket-legend">
          {Object.values(colors).map((color, i) => (
            <React.Fragment key={i}>
              {isBivariate &&
                Object.values(color).map(bivariateColor => (
                  <li className="bucket-item" key={bivariateColor}>
                    <div
                      className={cx(`bucket color-${bivariateColor.substr(1).toLowerCase()}`, {
                        '-highlighted': highlightedChoroplethBucket === bivariateColor
                      })}
                      style={{ backgroundColor: bivariateColor }}
                    />
                  </li>
                ))}
              {!isBivariate && (
                <li className="bucket-item">
                  <div
                    className={cx(`bucket color-${color.substr(1).toLowerCase()}`, {
                      '-highlighted': highlightedChoroplethBucket === color
                    })}
                    style={{ backgroundColor: color }}
                  >
                    {bucket && <span>{abbreviateNumber(bucket[0][i], 3, i)}</span>}
                  </div>
                </li>
              )}
            </React.Fragment>
          ))}
        </ul>

        {isBivariate && bucket && bucket[0] !== null && bucket[1] !== null && (
          <ul className="bucket-values">
            {[...bucket[0]].reverse().map(value => (
              <li>{abbreviateNumber(value, 3)}</li>
            ))}
            {[...bucket[1]].reverse().map(value => (
              <li>{abbreviateNumber(value, 3)}</li>
            ))}
          </ul>
        )}

        {!isBivariate && (
          <div className="unidimensional-legend-arrow">
            <ChoroArrow ticks={bucket[0].length} />
          </div>
        )}
        {isBivariate && (
          <svg className="icon icon-bidimensional-legend-arrows">
            <use xlinkHref="#icon-bidimensional-legend-arrows" />
          </svg>
        )}

        <ul className="bullets">
          <li className="bullet-container">
            <div className="bullet -color-gray" />
            <Text className="bullet-text" variant="mono" color="grey-faded" size="sm">
              N/A
            </Text>
          </li>
          <li className="bullet-container">
            <div className="bullet -color-white" />{' '}
            <Text className="bullet-text" variant="mono" color="grey-faded" size="sm">
              0
            </Text>
          </li>
        </ul>
      </div>
    </div>
  );
}

ChoroplethLegend.propTypes = {
  highlightedChoroplethBucket: PropTypes.string,
  isBivariate: PropTypes.bool,
  titles: PropTypes.array,
  colors: PropTypes.array,
  bucket: PropTypes.array
};

export default React.memo(ChoroplethLegend);
