import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import abbreviateNumber from 'utils/abbreviateNumber';
import ChoroArrow from './choro-arrow.component';

import 'react-components/tool/legend/choropleth-legend.scss';

function ChoroplethLegend(props) {
  const { currentHighlightedChoroplethBucket, isBivariate, titles, colors, bucket } = props;
  return (
    <div className="c-map-legend-choro">
      <div
        className={cx('bucket-container', {
          '-bidimensional': isBivariate,
          '-horizontal': !isBivariate,
          '-wide': isBivariate && bucket[0].length >= 7
        })}
      >
        <div className="bucket-names">
          {titles.map(title => (
            <div className="layer-name">{title}</div>
          ))}
        </div>
        <ul className="bucket-legend">
          {Object.values(colors).map((color, i) => (
            <>
              {isBivariate &&
                Object.values(color).map(bivariateColor => (
                  <li className="bucket-item">
                    <div
                      className={cx(`bucket color-${bivariateColor.substr(1).toLowerCase()}`, {
                        '-highlighted': currentHighlightedChoroplethBucket === bivariateColor
                      })}
                      style={{ backgroundColor: bivariateColor }}
                    />
                  </li>
                ))}
              {!isBivariate && (
                <li className="bucket-item">
                  <div
                    className={cx(`bucket color-${color.substr(1).toLowerCase()}`, {
                      '-highlighted': currentHighlightedChoroplethBucket === color
                    })}
                    style={{ backgroundColor: color }}
                  >
                    {bucket && <span>{abbreviateNumber(bucket[0][i], 3, i)}</span>}
                  </div>
                </li>
              )}
            </>
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
          <li>
            <div className="bullet color-dfdfdf" style={{ background: '#DFDFDF' }} />
            N/A
          </li>
          <li>
            <div className="bullet color-ffffff" style={{ background: '#ffffff' }} />0
          </li>
        </ul>
      </div>
    </div>
  );
}

ChoroplethLegend.propTypes = {
  currentHighlightedChoroplethBucket: PropTypes.object,
  isBivariate: PropTypes.bool,
  titles: PropTypes.array,
  colors: PropTypes.array,
  bucket: PropTypes.array
};

export default React.memo(ChoroplethLegend);
