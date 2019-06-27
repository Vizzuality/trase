/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import PropTypes from 'prop-types';
import Link from 'redux-first-router-link';
import Img from 'react-components/shared/img';

import './button-links.scss';

function ButtonLinks(props) {
  const { year, nodeId, contextId } = props;
  return (
    <div className="c-button-links hide-for-small">
      <div className="row">
        <div className="small-4 columns">
          <a className="link-button js-link-profile">
            <Img title="go to dashboard" src="/images/profiles/profile-main-option-1.svg" />
            <span className="js-link-button-name">WORLD IMPACT</span>
          </a>
        </div>
        <div className="small-4 columns">
          <Link
            className="link-button"
            to={{
              type: 'tool',
              payload: {
                serializerParams: {
                  isMapVisible: true,
                  selectedNodesIds: [nodeId],
                  expandedNodesIds: [nodeId],
                  selectedYears: [year, year],
                  selectedContextId: contextId
                }
              }
            }}
          >
            <span>LOCATION</span>
            <span>GO TO MAP</span>
            <Img title="Go to map" src="/images/profiles/profile-main-option-2.svg" />
            <svg className="icon icon-external-link">
              <use xlinkHref="#icon-external-link" />
            </svg>
          </Link>
        </div>
        <div className="small-4 columns">
          <Link
            className="link-button"
            to={{
              type: 'tool',
              payload: {
                serializerParams: {
                  isMapVisible: false,
                  selectedNodesIds: [nodeId],
                  expandedNodesIds: [nodeId],
                  selectedYears: [year, year],
                  selectedContext: contextId
                }
              }
            }}
          >
            <Img alt="" src="/images/profiles/profile-main-option-3.svg" />
            <span>CONNECTIONS</span>
            <svg className="icon icon-external-link">
              <use xlinkHref="#icon-external-link" />
            </svg>
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
