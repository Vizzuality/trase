import { YEARS_DISABLED_WARNINGS as W } from 'constants';

const getDimensionWarning = (reason) => {
  const reasonWarning = W[`${reason}_REASON`];
  const reasonInstruction = W[`${reason}_INSTRUCTION`];
  return [reasonWarning, reasonInstruction].join(' ');
};

const getMapDimensionsWarnings = (mapDimensions, selectedMapDimensionsUids) => {
  const dimensions = mapDimensions.filter(
    d => selectedMapDimensionsUids.indexOf(d.uid) > -1 && d.disabledYearRangeReason !== undefined
  );
  if (!dimensions.length) {
    return null;
  } else if (
    dimensions.length === 2
    && dimensions[0].disabledYearRangeReason === dimensions[1].disabledYearRangeReason
  ) {
    return [W.THOSE_LAYERS.replace('$layer0', dimensions[0].name).replace('$layer1', dimensions[1].name)]
      .concat(getDimensionWarning(dimensions[0].disabledYearRangeReason)).join(' ');
  }
  let warnings = [W.THAT_LAYER.replace('$layer', dimensions[0].name)]
    .concat(getDimensionWarning(dimensions[0].disabledYearRangeReason));

  if (dimensions.length === 2) {
    warnings = warnings
      .concat('<br>')
      .concat([W.THAT_LAYER.replace('$layer', dimensions[1].name)])
      .concat(getDimensionWarning(dimensions[1].disabledYearRangeReason));
  }
  return warnings.join(' ');
};

const getSingleMapDimensionWarning = reason => [W.THIS_LAYER].concat(getDimensionWarning(reason)).join(' ');

export { getMapDimensionsWarnings, getSingleMapDimensionWarning };
