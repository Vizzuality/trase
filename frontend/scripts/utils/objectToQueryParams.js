import omitBy from 'lodash/omitBy';
import isNil from 'lodash/isNil';

export default (input, settings = null) => {
  const qParams = input;

  // Allow to discard query params before parsing
  if (settings?.discard) {
    settings.discard.forEach(entry => {
      delete qParams[entry];
    });
  }

  // Remove any null or undefined query params
  const omitParamsNil = omitBy(qParams, isNil);

  if (typeof URLSearchParams === 'function') {
    return new URLSearchParams(omitParamsNil).toString();
  }

  // Older browsers fallback
  return Object.keys(omitParamsNil)
    .reduce((a, k) => {
      a.push(`${k}=${encodeURIComponent(omitParamsNil[k])}`);
      return a;
    }, [])
    .join('&');
};
