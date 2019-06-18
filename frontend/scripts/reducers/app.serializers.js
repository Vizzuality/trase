// TODO remove this: we shouldn't be storing the selectedContext object in the reducer
// There's no space for derived data in the store. However the app is depending on this
// a refactor is necessary, but not right now. I'm piggy backing on previous deserialize logic
export const selectedContext = {
  stringify(prop, DONT_SERIALIZE) {
    if (!prop) {
      return DONT_SERIALIZE;
    }
    return prop.id;
  },
  parse(param) {
    return {
      id: param,
      filterBy: [],
      resizeBy: [],
      recolorBy: [],
      defaultColumns: []
    };
  }
};
