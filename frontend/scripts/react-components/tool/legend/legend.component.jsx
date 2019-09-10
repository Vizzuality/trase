import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import abbreviateNumber from 'utils/abbreviateNumber';

import 'styles/components/tool/map/map-legend.scss';
import ChoroArrow from 'react-components/tool/choro-arrow/choro-arrow.component';

function Legend(props) {
  const {
    choroplethLegend,
    currentHighlightedChoroplethBucket,
    selectedMapContextualLayersData
  } = props;

  if (!choroplethLegend) {
    return null;
  }

  const { isBivariate, titles, colors, bucket } = choroplethLegend;
  return (
    <div
      className={cx('c-map-footer', {
        '-hidden':
          choroplethLegend === null &&
          (selectedMapContextualLayersData === undefined || !selectedMapContextualLayersData.length)
      })}
    >
      <div className="btn-map -map-layers js-basemap-switcher">
        <svg className="icon icon-layers">
          <use xlinkHref="#icon-layers" />
        </svg>
      </div>
      <div className="c-map-legend js-map-legend">
        <div className="js-map-legend-context c-map-legend-context" />
        {choroplethLegend && (
          <div className="js-map-legend-choro c-map-legend-choro">
            <div
              className={cx('bucket-container', {
                '-bidimensional': isBivariate,
                '-horizontal': !isBivariate,
                '-wide': isBivariate && bucket[0].length >= 7
              })}
            >
              <div className="bucket-names">
                <div className="layer-name">{titles[0]}</div>
                <div className="layer-name">{titles[1]}</div>
              </div>
              <ul className="bucket-legend">
                {Object.values(colors).map((color, i) => (
                  <>
                    {isBivariate &&
                      Object.values(color).map((bivariateColor, j) => (
                        <li className="bucket-item">
                          <div
                            className={cx(
                              `bucket color-${bivariateColor.substr(1).toLowerCase()}`,
                              {
                                '-highlighted':
                                  currentHighlightedChoroplethBucket === bivariateColor
                              }
                            )}
                            style={{ backgroundColor: bivariateColor }}
                          >
                            {!isBivariate && typeof bucket !== 'undefined' && bucket !== null && (
                              <span>{abbreviateNumber(bucket[0][j], 3, j)}</span>
                            )}
                          </div>
                        </li>
                      ))}
                    {!isBivariate && (
                      <li className="bucket-item">
                        <div
                          className={`bucket color-${color.substr(1).toLowerCase()}`}
                          style={{ backgroundColor: color }}
                        >
                          {!isBivariate && typeof bucket !== 'undefined' && bucket !== null && (
                            <span>{abbreviateNumber(bucket[0][i], 3, i)}</span>
                          )}
                        </div>
                      </li>
                    )}
                  </>
                ))}
              </ul>

              {isBivariate &&
                typeof bucket !== 'undefined' &&
                bucket[0] !== null &&
                bucket[1] !== null && (
                  <ul className="bucket-values">
                    {bucket[0].reverse().map(value => (
                      <li>{abbreviateNumber(value, 3)}</li>
                    ))}
                    {bucket[1].reverse().map(value => (
                      <li>{abbreviateNumber(value, 3)}</li>
                    ))}
                  </ul>
                )}

              <div className="js-choro-arrow unidimensional-legend-arrow">
                {!isBivariate && <ChoroArrow ticks={bucket[0].length} width="100%" />}
              </div>
              <svg className="icon icon-bidimensional-legend-arrows">
                <use xlinkHref="#icon-bidimensional-legend-arrows" />
              </svg>

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
        )}
      </div>
    </div>
  );
}

Legend.propTypes = {
  choroplethLegend: PropTypes.object,
  selectedMapContextualLayersData: PropTypes.object,
  currentHighlightedChoroplethBucket: PropTypes.string
};

export default Legend;
