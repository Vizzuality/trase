import {
  DASHBOARD_ELEMENT__GO_TO_DASHBOARD,
  DASHBOARD_ELEMENT__SET_SELECTED_YEARS,
  DASHBOARD_ELEMENT__SET_SELECTED_RECOLOR_BY,
  DASHBOARD_ELEMENT__SET_SELECTED_RESIZE_BY,
  DASHBOARD_ELEMENT__EDIT_DASHBOARD
} from 'react-components/dashboard-element-legacy/dashboard-element.actions';

import { DASHBOARD_WIDGET__TRACK_OPEN_TABLE_VIEW } from 'react-components/dashboard-element-legacy/dashboard-widget/dashboard-widget.actions';

export default [
  {
    type: DASHBOARD_ELEMENT__SET_SELECTED_RECOLOR_BY,
    action: 'Select Indicator',
    category: 'dashboards',
    getPayload: action => action.payload.indicator.value,
    shouldSend: action => action.payload.indicator.value !== 'none'
  },
  {
    type: DASHBOARD_ELEMENT__SET_SELECTED_RESIZE_BY,
    action: 'Select Unit',
    category: 'dashboards',
    getPayload: action => action.payload.indicator.value
  },
  {
    type: DASHBOARD_ELEMENT__SET_SELECTED_YEARS,
    action: 'Select Year',
    category: 'dashboards',
    getPayload: action => action.payload.years
  },
  {
    type: DASHBOARD_WIDGET__TRACK_OPEN_TABLE_VIEW,
    action: 'Open table',
    category: 'dashboards',
    getPayload: (action, state) => {
      const { title } = action.payload;
      const { countriesPanel, commoditiesPanel } = state.dashboardElement;
      const country = Object.values(countriesPanel.activeItems)[0];
      const commodity = Object.values(commoditiesPanel.activeItems)[0];

      return `${title} – ${country?.name} ${commodity?.name}`;
    }
  },
  {
    type: DASHBOARD_ELEMENT__EDIT_DASHBOARD,
    action: 'Edit selection',
    category: 'dashboards'
  },
  {
    type: DASHBOARD_ELEMENT__GO_TO_DASHBOARD,
    action(action) {
      const { dirtyBlocks } = action.payload;
      const panels = Object.entries(dirtyBlocks)
        .filter(entry => entry[1])
        .map(entry => entry[0]);

      return `Final selection (${panels})`;
    },
    category: 'dashboards',
    getPayload(action) {
      const { dynamicSentenceParts } = action.payload;
      return dynamicSentenceParts
        .filter(part => part.value)
        .map(
          part => `${part.id}: ${part.value.length === 1 ? part.value[0]?.name : part.value.length}`
        )
        .join('\n');
    }
  }
];
