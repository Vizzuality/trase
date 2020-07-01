const mapView = {
  stringify(prop, DONT_SERIALIZE) {
    if (!prop) {
      return DONT_SERIALIZE;
    }
    return [prop.latitude, prop.longitude, prop.zoom].join(',');
  },
  parse(param) {
    const [latitude, longitude, zoom] = param.split(',');
    return { latitude, longitude, zoom };
  }
};

const selectedMapDimensions = {
  stringify(prop, DONT_SERIALIZE) {
    if (!prop) {
      return DONT_SERIALIZE;
    }
    const dimensions = prop.filter(Boolean);

    // no map dimensions is not necessarily the default state, we have to be able to share it too
    if (dimensions.length === 0) {
      return 'none';
    }

    return dimensions.reduce((acc, id) => {
      if (!acc) {
        return id;
      }
      return `${acc}-${id}`;
    }, '');
  },
  parse(param) {
    if (param === 'none') {
      return [null, null];
    }

    const tuples = param.split('-');
    return tuples.reduce(
      (acc, id, index) => {
        acc[index] = id;
        return acc;
      },
      [null, null]
    );
  }
};

const selectedMapContextualLayers = {
  stringify(prop, DONT_SERIALIZE) {
    if (!prop || prop.length === 0) {
      return DONT_SERIALIZE;
    }
    return prop.join(',');
  },
  parse(param) {
    return param
    .toString()
    .split(',')
    .map(n => parseInt(n, 10));
  }
};

const selectedLogisticLayers = {
  stringify(prop, DONT_SERIALIZE) {
    if (!prop || prop.length === 0) {
      return DONT_SERIALIZE;
    }
    return prop.join(',');
  },
  parse(param) {
    return param
      .toString()
      .split(',')
  }
};

export default {
  urlPropHandlers: {
    mapView,
    selectedMapDimensions,
    selectedMapContextualLayers,
    selectedLogisticLayers
  },
  props: [
    'mapView',
    'toolLayout',
    'selectedBasemap',
    'selectedMapContextualLayers',
    'selectedLogisticLayers',
    'selectedMapDimensions'
  ]
};
