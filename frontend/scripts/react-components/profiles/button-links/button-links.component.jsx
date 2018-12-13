/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import PropTypes from 'prop-types';
import addApostrophe from 'utils/addApostrophe';
import capitalize from 'lodash/capitalize';
import Link from 'redux-first-router-link';

import './button-links.scss';

function ButtonLinks(props) {
  const {
    year,
    nodeId,
    contextId,
    data: { nodeName, municipalityName },
    scrollTo
  } = props;
  const name = nodeName || municipalityName;
  return (
    <div className="c-button-links hide-for-small">
      <div className="row">
        <div className="small-4 columns">
          <a className="link-button -with-arrow js-link-profile" onClickCapture={scrollTo}>
            <img alt="" src="/images/profiles/profile-main-option-1.svg" />
            <span className="js-link-button-name">
              <span className="notranslate">{name ? capitalize(name) : '-'}</span>
              {addApostrophe(name)} PROFILE
            </span>
          </a>
        </div>
        <div className="small-4 columns">
          <Link
            className="link-button"
            to={{
              type: 'tool',
              payload: {
                query: {
                  state: {
                    isMapVisible: true,
                    selectedNodesIds: [nodeId],
                    expandedNodesIds: [nodeId],
                    selectedYears: [year, year],
                    selectedContextId: contextId
                  }
                }
              }
            }}
          >
            <img alt="" src="/images/profiles/profile-main-option-2.svg" />
            <span>MAP</span>
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
                query: {
                  state: {
                    isMapVisible: false,
                    selectedNodesIds: [nodeId],
                    expandedNodesIds: [nodeId],
                    selectedYears: [year, year],
                    selectedContextId: contextId
                  }
                }
              }
            }}
          >
            <img alt="" src="/images/profiles/profile-main-option-3.svg" />
            <span>SUPPLY CHAIN</span>
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
  data: PropTypes.any,
  year: PropTypes.number.isRequired,
  nodeId: PropTypes.number.isRequired,
  contextId: PropTypes.number.isRequired,
  scrollTo: PropTypes.func.isRequired
};

export default ButtonLinks;
