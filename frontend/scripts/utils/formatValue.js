import { formatPrefix } from 'd3-format';
import { store } from '../index';

// returns a value rounded to numDecimals
export default (value, dimensionName) => {
  const { attributesMeta } = store.getState().app;

  if (value === undefined || value === null || value === 'NaN') {
    return '-';
  }
  if (typeof value !== 'number') {
    return value;
  }

  const dimensionNameLower = dimensionName.toLowerCase();

  // powerOfTenForRounding: ..., -3 (3 decimal places), -2 (2 decimal places), -1 (1 decimal place), 0, 1(k), 2(M), 3(G), ...

  const attribute = attributesMeta.find(
    a => a.displayName && a.displayName.toLowerCase() === dimensionNameLower
  );
  if (attribute && attribute.powerOfTenForRounding) {
    if (attribute.powerOfTenForRounding || attribute.powerOfTenForRounding === 0) {
      const round =
        attribute.powerOfTenForRounding < 0 ? Math.abs(attribute.powerOfTenForRounding) : 0;
      const exponent = attribute.powerOfTenForRounding > 0 ? attribute.powerOfTenForRounding : 0;
      return formatPrefix(`,.${round}`, parseFloat(`1e${exponent}`))(value);
    }

    if (attribute.powerOfTenForRounding === 0 && value < 1 && value > 0) {
      return '< 1';
    }

    return value.toLocaleString('en', {
      minimumFractionDigits: 0,
      maximumFractionDigits: Math.abs(attribute.powerOfTenForRounding)
    });
  }

  return value.toLocaleString('en', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
};
