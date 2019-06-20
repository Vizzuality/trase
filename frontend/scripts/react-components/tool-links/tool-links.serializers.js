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

export const selectedColumnsIds = {
  stringify(prop, DONT_SERIALIZE) {
    if (!prop || prop.length === 0) {
      return DONT_SERIALIZE;
    }

    return Object.entries(prop).reduce((acc, [group, id]) => {
      const tuple = `${group}_${id}`;
      if (!acc) {
        return tuple;
      }
      return `${acc}-${tuple}`;
    }, '');
  },
  parse(param) {
    const tuples = param.split('-');
    return tuples.reduce((acc, tuple) => {
      const [group, id] = tuple.split('_');
      acc[group] = Number(id);
      return acc;
    }, []);
  }
};
