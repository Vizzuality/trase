import { NUM_DECIMALS, NUM_DECIMALS_DEFAULT } from 'constants';

// returns a value rounded to numDecimals
export default (value, dimensionName) => {
  if (value === undefined || value === null) {
    return '-';
  }
  let maximumFractionDigits = NUM_DECIMALS_DEFAULT;

  const dimensionNameLower = dimensionName.toLowerCase();

  if (NUM_DECIMALS[dimensionNameLower] !== undefined) {
    maximumFractionDigits = NUM_DECIMALS[dimensionNameLower];
  }

  if (maximumFractionDigits === 0 && value < 1 && value > 0) {
    return '< 1';
  }

  return value.toLocaleString('en', {
    minimumFractionDigits: 0,
    maximumFractionDigits
  });
};
