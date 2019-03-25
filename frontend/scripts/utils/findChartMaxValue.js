import maxBy from 'lodash/maxBy';
import max from 'lodash/max';

export default (data, axisKeys) => {
  const maxValues = [];
  Object.keys(axisKeys).forEach(key => {
    Object.keys(axisKeys[key]).forEach(subKey => {
      maxValues.push(maxBy(data, subKey)[subKey]);
    });
  });
  return max(maxValues);
};
