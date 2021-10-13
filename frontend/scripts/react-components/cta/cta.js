import { createElement, useState } from 'react';
import Component from './cta-component';
import { CTA_VERSIONS } from './cta-versions-data';

const CTA_VERSION_KEY = 'TRASE_CTA_VIEWED_VERSION';

const CTAContainer = (props) => {
  const [localCtaVersion, setLocalCtaVersion] = useState(
    JSON.parse(localStorage.getItem(CTA_VERSION_KEY))
  );

  const handleOnRequestClose = () => {
    setLocalCtaVersion(CURRENT_CTA_VERSION);
    localStorage.setItem(CTA_VERSION_KEY, CURRENT_CTA_VERSION);
  };
  if (+localCtaVersion >= +CURRENT_CTA_VERSION) return null;

  return createElement(Component, {
    data: CTA_VERSIONS[CURRENT_CTA_VERSION],
    handleOnRequestClose,
    ...props
  });
};

export default CTAContainer;
