/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';

import 'styles/components/tool/map/map-legend.scss';
import './legend.scss';
import Text from 'react-components/shared/text/text.component';
import Icon from 'react-components/shared/icon/icon.component';
import ChoroplethLegend from './choropleth-legend.component';

function Legend(props) {
  const {
    toggleMapLayerMenu,
    choroplethLegend,
    highlightedChoroplethBucket,
    contextualLayers
  } = props;
  return (
    <div className="c-legend">
      <div className="legend-header">
        <button className="legend-layers-toggle" onClick={toggleMapLayerMenu}>
          <Icon icon="icon-layers" />
          <Text variant="mono" transform="uppercase" color="white">
            Edit Map Layers
          </Text>
        </button>
      </div>
      <div className="legend-container">
        <div
          className="c-map-legend-context"
          dangerouslySetInnerHTML={{
            __html: contextualLayers.reduce(
              (acc, contextualLayer) => `${acc}${contextualLayer.legend}\n`,
              ''
            )
          }}
        />
        {choroplethLegend && (
          <ChoroplethLegend
            bucket={choroplethLegend.bucket}
            titles={choroplethLegend.titles}
            colors={choroplethLegend.colors}
            isBivariate={choroplethLegend.isBivariate}
            highlightedChoroplethBucket={highlightedChoroplethBucket}
          />
        )}
      </div>
    </div>
  );
}

Legend.propTypes = {
  contextualLayers: PropTypes.array,
  choroplethLegend: PropTypes.object,
  toggleMapLayerMenu: PropTypes.func.isRequired,
  highlightedChoroplethBucket: PropTypes.string
};

export default Legend;
