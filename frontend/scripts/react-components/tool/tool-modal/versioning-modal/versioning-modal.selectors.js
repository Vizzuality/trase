import { createSelector } from 'reselect';
import { getSelectedContext } from 'reducers/app.selectors';
import versionJson from 'react-components/tool/tool-modal/versioning-modal/versions.json';

export const getVersionData = createSelector(
  getSelectedContext,
  selectedContext => {
    if (!selectedContext) return null;
    return versionJson.find(version => version.context_id === selectedContext.id);
  }
);

export const getTableData = createSelector(
  getVersionData,
  contextVersionData => {
    if (!contextVersionData) return null;
    const { key_statistics: keyStatistics } = contextVersionData;
    const years = Object.keys(keyStatistics[0].values);
    const rowTitle = row => ({
      value: `${row.name.replace(/_/g, ' ')}`,
      suffix: row.unit && row.unit !== 'number' ? `(${row.unit})` : ''
    });
    const data = keyStatistics.map(row => [rowTitle(row), ...Object.values(row.values)]);
    return {
      headers: [{ name: '' }, ...years.map(y => ({ name: y }))],
      data
    };
  }
);
