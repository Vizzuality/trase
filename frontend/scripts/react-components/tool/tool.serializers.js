import { DONT_SERIALIZE } from 'react-components/shared/url-serializer';

export const selectedNodesIds = {
  stringify(prop) {
    if (prop.length > 0) {
      return prop.join(',');
    }
    return DONT_SERIALIZE;
  },
  parse(param) {
    return param?.split(',').map(Number);
  }
};

export const selectedResizeBy = {
  stringify(prop) {
    if (!prop) {
      return DONT_SERIALIZE;
    }

    return prop.name;
  },
  parse(param) {
    return { name: param };
  }
};
