/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';

import './legend.scss';
import Text from 'react-components/shared/text/text.component';
import Icon from 'react-components/shared/icon/icon.component';
import ChoroplethLegend from './choropleth-legend.component';
import LogisticLegend from './logistic-legend';

function Legend(props) {
  const {
    openLayerModal,
    choroplethLegend,
    highlightedChoroplethBucket,
    contextualLayers,
    isHidden,
    hasLayers,
    logisticLayers
  } = props;
  if (isHidden) return null;
  return (
    <div className="c-legend">
      {hasLayers && (
        <div className="legend-header">
          <button className="legend-layers-toggle" onClick={openLayerModal}>
            <Icon icon="icon-layers" />
            <Text variant="mono" transform="uppercase" color="white">
              Edit Map Layers
            </Text>
          </button>
        </div>
      )}
      <div className="legend-container">
        <div
          className="map-legend-contextual"
          dangerouslySetInnerHTML={{
            __html: contextualLayers.reduce(
              (acc, contextualLayer) => `${acc}${contextualLayer.legend}\n`,
              ''
            )
          }}
        />
        {logisticLayers && (
          <LogisticLegend
            layers={logisticLayers}
          />
        )}
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
  logisticLayers: PropTypes.array,
  choroplethLegend: PropTypes.object,
  openLayerModal: PropTypes.func.isRequired,
  highlightedChoroplethBucket: PropTypes.string,
  isHidden: PropTypes.bool,
  hasLayers: PropTypes.bool
};

export default Legend;
