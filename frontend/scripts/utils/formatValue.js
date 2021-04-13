import { NUM_DECIMALS, NUM_DECIMALS_DEFAULT, NUM_EXPONENT_ROUNDING } from 'constants';
import { formatPrefix } from 'd3-format';

// returns a value rounded to numDecimals
export default (value, dimensionName) => {
  if (value === undefined || value === null || value === 'NaN') {
    return '-';
  }
  if (typeof value !== 'number') {
    return value;
  }

  let maximumFractionDigits = NUM_DECIMALS_DEFAULT;
  const dimensionNameLower = dimensionName.toLowerCase();

  if (NUM_DECIMALS[dimensionNameLower] !== undefined) {
    maximumFractionDigits = NUM_DECIMALS[dimensionNameLower];
  }

  const exponentToRoundTo = NUM_EXPONENT_ROUNDING[dimensionNameLower];
  if (exponentToRoundTo) {
    return formatPrefix(',.0', parseFloat(`1e${exponentToRoundTo}`))(value);
  }

  if (maximumFractionDigits === 0 && value < 1 && value > 0) {
    return '< 1';
  }

  return value.toLocaleString('en', {
    minimumFractionDigits: 0,
    maximumFractionDigits
  });
};
