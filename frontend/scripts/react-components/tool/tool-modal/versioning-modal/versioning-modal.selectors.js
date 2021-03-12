import versionJson from 'react-components/tool/tool-modal/versioning-modal/versions.json';

// Use context 0 for contexts without version and temporarily prior to adding a backend for this feature
export const getVersionData = () => versionJson.find(version => version.context_id === 0);
