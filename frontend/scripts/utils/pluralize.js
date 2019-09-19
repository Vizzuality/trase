import camelCase from 'lodash/camelCase';

export default name => {
  const camelCasedName = camelCase(name);
  const plural = {
    logisticsHub: 'logistics hubs',
    portOfImport: 'ports of import',
    portOfExport: 'ports of export',
    districtOfExport: 'districts of export'
  }[camelCasedName];

  if (!plural) {
    return camelCasedName.endsWith('y')
      ? camelCasedName.replace(/y$/, 'ies').toLowerCase()
      : `${camelCasedName}s`.toLowerCase();
  }

  return plural;
};
