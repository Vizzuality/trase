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

const extraColumn = {
  stringify(prop, DONT_SERIALIZE) {
    if (!prop) {
      return DONT_SERIALIZE;
    }
    const { parentId, id } = prop;
    return `${parentId}_${id}`;
  },
  parse(param) {
    const [parentId, id] = param.split('_');
    return {
      parentId: parseInt(parentId, 10),
      id: parseInt(id, 10)
    };
  }
};

export default {
  urlPropHandlers: {
    detailedView,
    selectedColumnsIds,
    extraColumn
  },
  props: [
    'selectedNodesIds',
    'selectedColumnsIds',
    'detailedView',
    'selectedResizeBy',
    'selectedRecolorBy',
    'extraColumn',
    'extraColumnNodeId',
    'selectedBiomeFilterName'
  ]
};
