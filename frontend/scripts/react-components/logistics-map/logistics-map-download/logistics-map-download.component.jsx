import React from 'react';
import PropTypes from 'prop-types';
import capitalize from 'lodash/capitalize';
import LogisticsMapModal from 'react-components/logistics-map/logistics-map-modal/logistics-map-modal.component';
import Button from 'react-components/shared/button/button.component';
import Heading from 'react-components/shared/heading/heading.component';

import 'react-components/logistics-map/logistics-map-download/logistics-map-download.scss';

const mapLayerToLink = layer => (
  <div className="column small-12 medium-6" key={layer.name}>
    <Button
      as="a"
      size="lg"
      icon="icon-download"
      color="charcoal-transparent"
      className="logistics-map-download-link"
      target="_blank"
      rel="noreferrer noopener"
      href={layer.downloadUrl}
    >
      {capitalize(layer.name)}
    </Button>
  </div>
);

const renderLayers = layers => {
  if (layers.palmOil) {
    return (
      <div className="row">
        <div className="column small-12">
          <Heading as="h3" weight="bold">
            Palm Oil
          </Heading>
        </div>
        {layers.palmOil.map(mapLayerToLink)}
      </div>
    );
  }
  return (
    <>
      <div className="row">
        <div className="column small-12">
          <Heading as="h3" weight="bold">
            Soy
          </Heading>
        </div>
        {layers.soy.map(mapLayerToLink)}
      </div>

      <div className="row">
        <div className="column small-12">
          <Heading as="h3" weight="bold">
            Cattle
          </Heading>
        </div>
        {layers.cattle.map(mapLayerToLink)}
      </div>
    </>
  );
};

function LogisticsMapDownload(props) {
  const { close, layers } = props;
  return (
    <LogisticsMapModal
      heading="Download"
      content={<div className="c-logistics-map-download">{renderLayers(layers)}</div>}
      footer={
        <>
          <Button size="md" color="pink" onClick={close}>
            Close
          </Button>
        </>
      }
    />
  );
}

LogisticsMapDownload.propTypes = {
  close: PropTypes.func.isRequired,
  layers: PropTypes.shape({ soy: PropTypes.array, cattle: PropTypes.array }).isRequired
};

export default LogisticsMapDownload;
