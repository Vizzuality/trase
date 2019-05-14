export CookieBannerComponent from 'react-components/cookie-banner/cookie-banner.component';

const acceptedCookieBanner = {
  key: 'acceptedCookieBanner__TRASE_EARTH',
  get() {
    return localStorage.getItem(this.key);
  },
  set(key) {
    return localStorage.setItem(this.key, key);
  }
};

const CookieBannerContainer = () => {
  return acceptedCookieBanner.get(this.key) ? null :
    CookieBannerComponent({
      setAccepted: acceptedCookieBanner.set(Date.now())
    });
}

export default CookieBannerContainer;