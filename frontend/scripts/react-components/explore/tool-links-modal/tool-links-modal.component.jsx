import React from 'react';
import PropTypes from 'prop-types';
import Heading from 'react-components/shared/heading/heading.component';
import Text from 'react-components/shared/text/text.component';
import { ImgBackground } from 'react-components/shared/img';

import 'react-components/explore/tool-links-modal/tool-links-modal.scss';

function ToolLinksModal({ goToTool }) {
  return (
    <div className="c-tool-links-modal">
      <div className="row columns">
        <Heading size="md" className="modal-title">
          Choose type of visualization
        </Heading>
      </div>
      <div className="links-container">
        <div className="row">
          <div className="small-12 medium-6 column">
            <button className="tool-link" onClick={() => goToTool('sankey')}>
              <ImgBackground />
              <Heading weight="bold" variant="mono">
                FLOW VIEW
              </Heading>
            </button>
          </div>
          <div className="small-12 medium-6 column">
            <button className="tool-link" onClick={() => goToTool('data')}>
              <ImgBackground />
              <Heading weight="bold" variant="mono">
                DATA VIEW
              </Heading>
            </button>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="column small-12 medium-6">
          <ul className="description-list">
            <li>
              <Text>Visualize the data in real flows.</Text>
            </li>
            <li>
              <Text>Highlight and manage the data as you wish.</Text>
            </li>
          </ul>
        </div>
        <div className="column small-12 medium-6">
          <ul className="description-list">
            <li>
              <Text>Visualize the data in our charts.</Text>
            </li>
            <li>
              <Text>Compare the data between different actors.</Text>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

ToolLinksModal.propTypes = {
  goToTool: PropTypes.func
};

export default ToolLinksModal;
