const detailedView = {
  parse(param) {
    return JSON.parse(param);
  }
};

const selectedColumnsIds = {
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

export default {
  urlPropHandlers: {
    detailedView,
    selectedColumnsIds
  },
  props: [
    'selectedNodesIds',
    'selectedColumnsIds',
    'expandedNodesIds',
    'detailedView',
    'selectedResizeBy',
    'selectedRecolorBy',
    'extraColumnId',
    'extraColumnNodeId',
    'selectedBiomeFilterName'
  ]
};
