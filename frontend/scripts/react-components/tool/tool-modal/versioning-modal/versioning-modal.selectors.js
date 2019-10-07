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
