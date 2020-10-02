import React from 'react';
import PropTypes from 'prop-types';
import Heading from 'react-components/shared/heading/heading.component';

import 'react-components/logistics-map/logistics-map-modal/logistics-map-modal.scss';

function LogisticsMapModal(props) {
  const { content, footer, heading } = props;

  return (
    <div className="c-logistics-map-modal">
      <Heading size="md" align="center">
        {heading}
      </Heading>
      {content}
      <div className="logistics-map-modal-footer">{footer}</div>
    </div>
  );
}

LogisticsMapModal.propTypes = {
  heading: PropTypes.string,
  footer: PropTypes.element,
  content: PropTypes.element
};

export default LogisticsMapModal;
