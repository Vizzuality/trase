export const detailedView = {
  parse(param) {
    return JSON.parse(param);
  }
};

export const selectedResizeBy = {
  stringify(prop, DONT_SERIALIZE) {
    if (!prop) {
      return DONT_SERIALIZE;
    }

    return prop.name;
  },
  parse(param) {
    return { name: param };
  }
};
