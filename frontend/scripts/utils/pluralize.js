import camelCase from 'lodash/camelCase';
import pluralize from 'pluralize';

export default name => {
  const camelCasedName = camelCase(name);
  const pluralException = {
    portOfImport: 'ports of import',
    portOfExport: 'ports of export',
    districtOfExport: 'districts of export',
    countryOfProduction: 'country of production'
  }[camelCasedName];
  if (pluralException) {
    return pluralException;
  }
  const words = name.toLowerCase().trim().split(' ');
  if (words.length > 1) {
    words[words.length - 1] = pluralize(words[words.length - 1]);
    return words.join(' ');
  }
  return pluralize(camelCasedName.toLowerCase());
};
