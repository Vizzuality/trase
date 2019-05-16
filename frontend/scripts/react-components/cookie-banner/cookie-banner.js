import CookieBannerComponent from 'react-components/cookie-banner/cookie-banner.component';

const CookieBannerContainer = () => {
  const key = 'acceptedCookieBanner__TRASE_EARTH';
  const acceptedCookieBanner = {
    get() {
      return localStorage.getItem(key);
    },
    set(date) {
      return localStorage.setItem(key, date);
    }
  };
  return acceptedCookieBanner.get(key)
    ? null
    : CookieBannerComponent({
        setAccepted: () => acceptedCookieBanner.set(Date.now())
      });
};

export default CookieBannerContainer;
