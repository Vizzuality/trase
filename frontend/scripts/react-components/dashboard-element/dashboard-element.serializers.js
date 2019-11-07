const indicatorsSerializer = {
  stringify(prop, DONT_SERIALIZE) {
    if (!prop || !prop.attributeId) {
      return DONT_SERIALIZE;
    }
    return prop.attributeId;
  },
  parse(param) {
    return param;
  }
};

const selectedResizeBy = indicatorsSerializer;
const selectedRecolorBy = indicatorsSerializer;

export default {
  urlPropHandlers: {
    selectedResizeBy,
    selectedRecolorBy
  },
  props: [
    'selectedYears',
    'selectedResizeBy',
    'selectedRecolorBy',
  ]
};