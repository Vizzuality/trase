import qs from 'qs';
import isArray from 'lodash/isArray';

export default params => {
  const isANumber = n => !isArray(n) && !Number.isNaN(parseFloat(n));
  const isInteger = n => n % 1 === 0;

  const parsedParams = qs.parse(params, { ignoreQueryPrefix: true, arrayLimit: 500 });
  const parsedNumbersInParams = { ...parsedParams };
  Object.keys(parsedParams).forEach(key => {
    const value = parsedParams[key];
    if (isArray(value)) {
      parsedNumbersInParams[key] = value.map(v =>
        isANumber(v) && isInteger(v) ? parseInt(v, 10) : v
      );
    } else if (isANumber(value) && isInteger(value))
      parsedNumbersInParams[key] = parseInt(value, 10);
  });
  return parsedNumbersInParams;
};
