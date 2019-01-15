import React from 'react';
import PropTypes from 'prop-types';
import startCase from 'lodash/startCase';
import LogisticsMapModal from 'react-components/logistics-map/logistics-map-modal/logistics-map-modal.component';
import Button from 'react-components/shared/button/button.component';
import Text from 'react-components/shared/text/text.component';
import layers from 'react-components/logistics-map/logistics-map-layers';

import 'react-components/logistics-map/logistics-map-download/logistics-map-download.scss';

function LogisticsMapDownload(props) {
  const { close } = props;
  return (
    <LogisticsMapModal
      heading="Download"
      content={
        <ul className="c-logistics-map-download">
          {layers.map(layer => (
            <li>
              <a target="_blank" rel="noreferrer noopener" href={layer.downloadUrl}>
                <Text weight="bold">{startCase(layer.name)}</Text>
              </a>
            </li>
          ))}
        </ul>
      }
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
  close: PropTypes.func.isRequired
};

export default LogisticsMapDownload;
