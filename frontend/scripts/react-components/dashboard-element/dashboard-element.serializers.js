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
export const countriesPanel = activeItemsSerializer;
export const sourcesPanel = activeItemsSerializer;
export const commoditiesPanel = activeItemsSerializer;
export const destinationsPanel = activeItemsSerializer;
export const companiePanel = activeItemsSerializer;
