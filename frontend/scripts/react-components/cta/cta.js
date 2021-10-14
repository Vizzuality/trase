/* eslint-disable no-undef */
import { createElement, useState } from 'react';
import { connect } from 'react-redux';
import { getContexts } from 'react-components/explore/explore.selectors';
import Component from './cta-component';
import { getCTAData } from './cta-versions-data';

const CTA_VERSION_KEY = 'TRASE_CTA_VIEWED_VERSION';

const mapStateToProps = state => ({
  contexts: getContexts(state)
});

const CTAContainer = ({ contexts }) => {
  const [localCtaVersion, setLocalCtaVersion] = useState(
    JSON.parse(localStorage.getItem(CTA_VERSION_KEY))
  );

  const handleOnRequestClose = () => {
    setLocalCtaVersion(CURRENT_CTA_VERSION);
    localStorage.setItem(CTA_VERSION_KEY, CURRENT_CTA_VERSION);
  };
  if (+localCtaVersion >= +CURRENT_CTA_VERSION) return null;

  const data = getCTAData(CURRENT_CTA_VERSION, contexts);
  return createElement(Component, {
    data,
    handleOnRequestClose
  });
};

export default connect(mapStateToProps, null)(CTAContainer);
