export const mapView = {
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
