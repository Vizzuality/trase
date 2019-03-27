import maxBy from 'lodash/maxBy';
import max from 'lodash/max';

export default (data, axisKeys) => {
  const maxValues = [];
  Object.keys(axisKeys).forEach(key => {
    if (axisKeys[key]) {
      Object.keys(axisKeys[key]).forEach(subKey => {
        const maxPoint = maxBy(data, subKey);
        const maxValue = maxPoint ? maxPoint[subKey] : 0;
        maxValues.push(maxValue);
      });
    }
  });
  return max(maxValues);
};
