import React from 'react';
import PropTypes from 'prop-types';
import Heading from 'react-components/shared/heading/heading.component';
import Text from 'react-components/shared/text/text.component';
import { ImgBackground } from 'react-components/shared/img';

import 'react-components/explore/tool-links-modal/tool-links-modal.scss';

function ToolLinksModal({ goToTool }) {
  const bulletPoints = {
    left: ['Visualize the data in real flows.', 'Highlight and manage the data as you wish.'],
    right: ['Visualize the data in our charts.', 'Compare the data between different actors.']
  };
  return (
    <div className="c-tool-links-modal">
      <div className="row columns">
        <Heading size="md" className="modal-title" align="center">
          Choose the{' '}
          <Heading as="span" size="md" weight="bold">
            type of visualization
          </Heading>
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
            {bulletPoints.left.map((point, i) => (
              <li className="bullet-point" key={i}>
                <Text size="rg" weight="bold" lineHeight="lg">
                  {point}
                </Text>
              </li>
            ))}
          </ul>
        </div>
        <div className="column small-12 medium-6">
          <ul className="description-list">
            {bulletPoints.right.map((point, i) => (
              <li className="bullet-point" key={i}>
                <Text size="rg" weight="bold" lineHeight="lg">
                  {point}
                </Text>
              </li>
            ))}
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
