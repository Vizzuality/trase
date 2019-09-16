import React from 'react';
import PropTypes from 'prop-types';

import 'styles/components/tool/map/map-legend.scss';
import './legend.scss';
import Text from 'react-components/shared/text/text.component';
import Icon from 'react-components/shared/icon/icon.component';
import ChoroplethLegend from './choropleth-legend.component';

function Legend(props) {
  const { toggleMapLayerMenu, choroplethLegend, currentHighlightedChoroplethBucket } = props;
  return (
    <div className="c-legend">
      <div className="legend-header">
        <button className="legend-layers-toggle" onClick={toggleMapLayerMenu}>
          <Icon icon="icon-layers" />
          <Text variant="mono" transform="uppercase">
            Edit Map Layers
          </Text>
        </button>
      </div>
      <div className="legend-container">
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
  toggleMapLayerMenu: PropTypes.func.isRequired,
  currentHighlightedChoroplethBucket: PropTypes.string
};

export default Legend;
