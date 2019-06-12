import React, { useState, useEffect } from 'react';
import CookieBannerComponent from 'react-components/shared/cookie-banner/cookie-banner.component';

const acceptedCookieBanner = {
  key: 'TRASE_EARTH_ACCEPTED_COOKIE_BANNER',
  get() {
    return localStorage.getItem(this.key);
  },
  set(date) {
    return localStorage.setItem(this.key, date);
  }
};

const CookieBannerContainer = () => {
  const [acceptedTimeStamp, setAccepted] = useState(acceptedCookieBanner.get());

  useEffect(() => {
    if (!acceptedCookieBanner.get() && acceptedTimeStamp) {
      acceptedCookieBanner.set(Date.now());
    }
  }, [acceptedTimeStamp]);

  return (
    <CookieBannerComponent
      setAccepted={() => setAccepted(true)}
      acceptedTimeStamp={acceptedTimeStamp}
    />
  );
};

export default CookieBannerContainer;
