import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import ChoroplethLegend from './choropleth-legend.component';

import 'styles/components/tool/map/map-legend.scss';

function Legend(props) {
  const {
    choroplethLegend,
    currentHighlightedChoroplethBucket,
    selectedMapContextualLayersData
  } = props;
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
          <ChoroplethLegend
            bucket={choroplethLegend.bucket}
            titles={choroplethLegend.titles}
            colors={choroplethLegend.colors}
            isBivariate={choroplethLegend.isBivariate}
            currentHighlightedChoroplethBucket={currentHighlightedChoroplethBucket}
          />
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
