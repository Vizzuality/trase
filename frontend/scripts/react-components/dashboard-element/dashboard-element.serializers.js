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

export const selectedResizeBy = indicatorsSerializer;
export const selectedRecolorBy = indicatorsSerializer;
