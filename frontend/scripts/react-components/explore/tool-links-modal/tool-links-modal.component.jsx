import React from 'react';
import PropTypes from 'prop-types';
import Heading from 'react-components/shared/heading/heading.component';
import Text from 'react-components/shared/text/text.component';
import { ImgBackground } from 'react-components/shared/img';

import 'react-components/explore/tool-links-modal/tool-links-modal.scss';

function ToolLinksModal({ goToTool }) {
  const bulletPoints = {
    left: [
      'Follow trade flows to identify sourcing regions.',
      'Highlight and manage the data as you wish.',
      'Expand and explore concrete actors of the flow.'
    ],
    right: [
      'Compare the data between different actors.',
      'Explore all kind of rankings.',
      'See all and particular data in every widget.'
    ]
  };
  const renderBulletPoint = (point, i) => (
    <li className="bullet-point" key={i}>
      <Text color="blue" variant="sans" lineHeight="lg">
        {point}
      </Text>
    </li>
  );

  return (
    <div className="c-tool-links-modal">
      <div className="row columns">
        <Heading size="md" variant="sans" className="modal-title" align="center">
          Choose{' '}
          <Heading as="span" size="md" variant="sans" weight="bold">
            type of visualization
          </Heading>
        </Heading>
      </div>
      <div className="links-container">
        <div className="row">
          <div className="small-12 medium-6 column">
            <ImgBackground
              as="button"
              src="/images/backgrounds/SANKEY_MODE.png"
              className="tool-link"
              onClick={() => goToTool('sankey')}
              data-test="explore-link-to-sankey"
            >
              <Heading size="md" weight="bold" variant="sans">
                FLOW VIEW
              </Heading>
            </ImgBackground>
          </div>
          <div className="small-12 medium-6 column">
            <ImgBackground
              as="button"
              src="/images/backgrounds/DATA_VIEW_MODE.png"
              className="tool-link"
              onClick={() => goToTool('dashboard')}
              data-test="explore-link-to-dashboard"
            >
              <Heading size="md" weight="bold" variant="sans">
                DATA VIEW
              </Heading>
            </ImgBackground>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="column small-12 medium-6">
          <ul className="description-list">{bulletPoints.left.map(renderBulletPoint)}</ul>
        </div>
        <div className="column small-12 medium-6">
          <ul className="description-list">{bulletPoints.right.map(renderBulletPoint)}</ul>
        </div>
      </div>
    </div>
  );
}

ToolLinksModal.propTypes = {
  goToTool: PropTypes.func
};

export default ToolLinksModal;
