import reducerRegistry from 'reducer-registry';
import reducer from './explore.reducer';

reducerRegistry.register('legacyExplore', reducer);

// not ideal because you have to change in two, but still better than changing across all app
export {
  EXPLORE__SET_TOP_COUNTRIES,
  EXPLORE__SET_TOP_EXPORTERS,
  EXPLORE__SET_TOP_NODES_LOADING,
  EXPLORE__SET_SELECTED_TABLE_COLUMN_TYPE,
  setExploreTopNodes,
  setSelectedTableColumnType,
  setExploreTopNodesLoading
} from './explore.actions';
