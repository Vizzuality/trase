import React, { useState, useEffect } from 'react';
import MethodsBannerComponent from 'react-components/shared/methods-disclaimer-banner/methods-disclaimer-banner.component';

const acceptedMethodsBanner = {
  key: 'TRASE_EARTH_ACCEPTED_METHODS_DISCLAIMER',
  get() {
    return localStorage.getItem(this.key);
  },
  set(date) {
    return localStorage.setItem(this.key, date);
  }
};

const initAccepted = () => {
  const value = acceptedMethodsBanner.get();
  if (value) {
    return typeof JSON.parse(value) === 'number';
  }
  return false;
};

const MethodsBannerContainer = () => {
  const [accepted, setAccepted] = useState(initAccepted);

  useEffect(() => {
    if (!acceptedMethodsBanner.get() && accepted === true) {
      acceptedMethodsBanner.set(Date.now());
    }
  }, [accepted]);

  return <MethodsBannerComponent setAccepted={() => setAccepted(true)} accepted={accepted} />;
};

export default MethodsBannerContainer;
