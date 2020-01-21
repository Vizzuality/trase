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
          Choose how you would like to view the data
        </Heading>
      </div>
      <div className="links-container">
        <div className="row">
          <div className="small-12 medium-6 column">
            <button
              className="tool-link"
              onClick={() => goToTool('sankey')}
              data-test="explore-link-to-sankey"
            >
              <ImgBackground />
              <Heading weight="bold" variant="mono">
                FLOW VIEW
              </Heading>
            </button>
          </div>
          <div className="small-12 medium-6 column">
            <button
              className="tool-link"
              onClick={() => goToTool('dashboard')}
              data-test="explore-link-to-dashboard"
            >
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
              <Text>Visualise commodity flows</Text>
            </li>
            <li>
              <Text>
                Select and deselect flows to explore relationships between supply and demand
              </Text>
            </li>
          </ul>
        </div>
        <div className="column small-12 medium-6">
          <ul className="description-list">
            <li>
              <Text>Get a chart-based overview of our data</Text>
            </li>
            <li>
              <Text>Make comparisons between places and actors</Text>
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
