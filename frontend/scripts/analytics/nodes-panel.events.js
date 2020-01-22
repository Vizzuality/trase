import {
  NODES_PANEL__SET_ORDER_BY,
  NODES_PANEL__SET_EXCLUDING_MODE
} from 'react-components/nodes-panel/nodes-panel.actions';

export default [
  {
    type: NODES_PANEL__SET_EXCLUDING_MODE,
    category: 'Nodes Panel',
    action: 'Set excluding mode (select all)'
  },
  {
    type: NODES_PANEL__SET_ORDER_BY,
    category: 'Nodes Panel',
    action: 'Set order by',
    getPayload(action) {
      const { orderBy } = action.payload;
      return orderBy;
    }
  }
];
