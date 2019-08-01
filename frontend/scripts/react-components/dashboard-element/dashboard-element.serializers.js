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
      searchResults: [],
      loadingItems: false,
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
      activeItems,
      searchResults: [],
      loadingItems: false
    };
  }
};

export const countriesPanel = activeItemsSerializer;
export const sourcesPanel = activeItemTabSerializer;
export const commoditiesPanel = activeItemsSerializer;
export const destinationsPanel = activeItemsSerializer;
export const companiesPanel = activeItemTabSerializer;

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
