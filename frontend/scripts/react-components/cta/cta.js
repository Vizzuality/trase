/* eslint-disable no-undef */
import { createElement, useState } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import { getContexts } from 'react-components/explore/explore.selectors';
import Component from './cta-component';
import { getCTAData } from './cta-versions-data';

const CTA_VERSION_KEY = 'TRASE_CTA_VIEWED_VERSION';

const mapStateToProps = state => ({
  contexts: getContexts(state)
});

const CTAContainer = ({ contexts }) => {
  const initialVersionInfo = localStorage.getItem(CTA_VERSION_KEY);
  const [localCtaVersion, setLocalCtaVersion] = useState(
    initialVersionInfo && JSON.parse(initialVersionInfo)
  );

  if (!+CURRENT_CTA_VERSION || +localCtaVersion >= +CURRENT_CTA_VERSION) {
    return null;
  }

  const data = getCTAData(CURRENT_CTA_VERSION, contexts);

  if (!data) {
    return null;
  }

  const handleOnRequestClose = () => {
    setLocalCtaVersion(CURRENT_CTA_VERSION);
    localStorage.setItem(CTA_VERSION_KEY, CURRENT_CTA_VERSION);
  };

  return createElement(Component, {
    data,
    handleOnRequestClose
  });
};

CTAContainer.propTypes = {
  contexts: PropTypes.array
};

export default connect(mapStateToProps, null)(CTAContainer);
