/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import PropTypes from 'prop-types';
import Link from 'redux-first-router-link';
import Img from 'react-components/shared/img';
import Heading from 'react-components/shared/heading';
import Text from 'react-components/shared/text';
import Icon from 'react-components/shared/icon';
import { TOOL_LAYOUT } from 'constants';

import './button-links.scss';

function ButtonLinks(props) {
  const { year, nodeId, contextId } = props;
  return (
    <div className="c-button-links">
      <div className="row button-links-row">
        <div className="columns small-12 medium-6 link-container">
          <Link
            className="link-button"
            to={{
              type: 'tool',
              payload: {
                serializerParams: {
                  toolLayout: TOOL_LAYOUT.left,
                  selectedNodesIds: [nodeId],
                  expandedNodesIds: [nodeId],
                  selectedYears: [year, year],
                  selectedContextId: contextId
                }
              }
            }}
          >
            <div>
              <Heading weight="bold" as="h4" variant="mono" size="rg">
                LOCATION IMPACT
              </Heading>
              <div className="link-text">
                <Text variant="mono" color="grey-faded" size="md" as="span">
                  GO TO MAP
                </Text>
                <Icon icon="icon-external-link" color="elephant" />
              </div>
            </div>
            <Img title="Go to map" src="/images/profiles/profile-main-option-2.svg" />
          </Link>
        </div>
        <div className="columns small-12 medium-6 link-container">
          <Link
            className="link-button"
            to={{
              type: 'tool',
              payload: {
                serializerParams: {
                  toolLayout: TOOL_LAYOUT.right,
                  selectedNodesIds: [nodeId],
                  expandedNodesIds: [nodeId],
                  selectedYears: [year, year],
                  selectedContextId: contextId
                }
              }
            }}
          >
            <div>
              <Heading weight="bold" as="h4" variant="mono" size="rg">
                CONNECTIONS
              </Heading>
              <div className="link-text">
                <Text variant="mono" color="grey-faded" size="md" as="span">
                  GO TO SUPPLY CHAIN
                </Text>
                <Icon icon="icon-external-link" color="elephant" />
              </div>
            </div>
            <Img title="Go to supply chain" src="/images/profiles/profile-main-option-3.svg" />
          </Link>
        </div>
      </div>
    </div>
  );
}

ButtonLinks.propTypes = {
  year: PropTypes.number.isRequired,
  nodeId: PropTypes.number.isRequired,
  contextId: PropTypes.number.isRequired
};

export default ButtonLinks;
