import isIe from 'utils/isIe';

export default () => (isIe() ? window.pageYOffset : window.scrollY);
