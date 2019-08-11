const activeItemsSerializer = {
  stringify(prop, DONT_SERIALIZE) {
    if (!prop || prop.activeItems.length === 0) {
      return DONT_SERIALIZE;
    }
    return prop.activeItems.join(',');
  },
  parse(param) {
    const activeItems = param ? `${param}`.split(',').map(Number) : [];
    return {
      page: 1,
      activeItems,
      activeTab: null
    };
  }
};

const activeItemTabSerializer = {
  stringify(prop, DONT_SERIALIZE) {
    if (!prop || prop.activeItems.length === 0) {
      return DONT_SERIALIZE;
    }

    return `${prop.activeTab}_${prop.activeItems.join(',')}`;
  },
  parse(param) {
    let activeItems = [];
    let activeTab = null;

    if (param) {
      const [activeTabStr, activeItemsStr] = param.split('_');
      activeTab = Number(activeTabStr);
      activeItems = activeItemsStr.split(',').map(Number);
    }

    return {
      page: 1,
      activeTab,
      activeItems
    };
  }
};

export const countries = activeItemsSerializer;
export const sources = activeItemTabSerializer;
export const commodities = activeItemsSerializer;
export const destinations = activeItemsSerializer;
export const companies = activeItemTabSerializer;

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
