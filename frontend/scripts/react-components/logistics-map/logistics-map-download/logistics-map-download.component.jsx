import React from 'react';
import PropTypes from 'prop-types';
import LogisticsMapModal from 'react-components/logistics-map/logistics-map-modal/logistics-map-modal.component';
import Button from 'react-components/shared/button/button.component';

function LogisticsMapDownload(props) {
  const { close } = props;

  return (
    <LogisticsMapModal
      heading="Download layers data"
      content={<></>}
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
