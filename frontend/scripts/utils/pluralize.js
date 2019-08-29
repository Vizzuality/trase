import camelCase from 'lodash/camelCase';

export default name => {
  const camelCasedName = camelCase(name);
  return {
    portOfImport: 'ports of import',
    portOfExport: 'ports of export',
    districtOfExport: 'districts of export'
  }[camelCasedName] || camelCasedName.endsWith('y')
    ? camelCasedName.replace(/y$/, 'ies').toLowerCase()
    : `${camelCasedName}s`.toLowerCase();
};
