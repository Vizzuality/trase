import intersection from 'lodash/intersection';
import { YEARS_DISABLED_WARNINGS as W, YEARS_INCOMPLETE } from 'constants';

const getDimensionWarning = (reason, existingYears) => {
  const reasonWarning = W[`${reason}_REASON`];
  const reasonInstruction = W[`${reason}_INSTRUCTION`].replace('$years', existingYears);

  return [reasonWarning, reasonInstruction].join(' ');
};

const getMapDimensionsWarnings = (
  mapDimensions,
  selectedMapDimensionsUids,
  [startYear, endYear]
) => {
  const dimensions = mapDimensions.filter(
    d =>
      selectedMapDimensionsUids.indexOf(d.uid) > -1 &&
      typeof d.disabledYearRangeReason !== 'undefined'
  );
  const allSelectedYears = Array(endYear - startYear + 1)
    .fill(startYear)
    .map((year, index) => year + index);
  if (dimensions.length === 0) {
    return null;
  } else if (
    dimensions.length === 2 &&
    dimensions[0].disabledYearRangeReason === dimensions[1].disabledYearRangeReason &&
    dimensions[0].disabledYearRangeReason !== YEARS_INCOMPLETE
  ) {
    return [
      W.THOSE_LAYERS.replace('$layer0', dimensions[0].name).replace('$layer1', dimensions[1].name)
    ]
      .concat(getDimensionWarning(dimensions[0].disabledYearRangeReason))
      .join(' ');
  }
  let warnings = [W.THAT_LAYER.replace('$layer', dimensions[0].name)].concat(
    getDimensionWarning(
      dimensions[0].disabledYearRangeReason,
      intersection(dimensions[0].years, allSelectedYears)
    )
  );

  if (dimensions.length === 2) {
    warnings = warnings
      .concat('<br>')
      .concat([W.THAT_LAYER.replace('$layer', dimensions[1].name)])
      .concat(
        getDimensionWarning(
          dimensions[1].disabledYearRangeReason,
          intersection(dimensions[1].years, allSelectedYears)
        )
      );
  }
  return warnings.join(' ');
};

const getSingleMapDimensionWarning = (reason, existingYears) =>
  [W.THIS_LAYER].concat(getDimensionWarning(reason, existingYears)).join(' ');

export { getMapDimensionsWarnings, getSingleMapDimensionWarning };
