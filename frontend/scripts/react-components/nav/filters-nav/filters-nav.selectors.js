import { createSelector } from 'reselect';
import { NAV_FILTER_TYPES, LOGISTICS_MAP_HUBS, LOGISTICS_MAP_INSPECTION_LEVELS } from 'constants';
import { getSelectedContext } from 'app/app.selectors';
import {
  getActiveParams,
  getSelectedCommodity as getLogisticsMapCommodity
} from 'react-components/logistics-map/logistics-map.selectors';

const insertIf = (condition, item) => (condition ? [item] : []);

const getCurrentPage = state => state.location.type;

const getLogisticsMapHubsProps = createSelector(
  [getActiveParams],
  activeParams => ({
    label: 'Logistics Hub',
    id: 'logisticsMapHub',
    options: LOGISTICS_MAP_HUBS,
    value: LOGISTICS_MAP_HUBS.find(commodity => commodity.value === activeParams.commodity)
  })
);

const getLogisticsMapInspectionLevelProps = createSelector(
  [getActiveParams],
  activeParams => {
    if (activeParams.commodity !== 'cattle') {
      return null;
    }

    const all = { label: 'All', value: null };

    return {
      label: 'Inspection Level',
      id: 'logisticsMapInspectionLevel',
      options: [all, ...LOGISTICS_MAP_INSPECTION_LEVELS],
      value:
        LOGISTICS_MAP_INSPECTION_LEVELS.find(level => level.value === activeParams.inspection) ||
        all
    };
  }
);

export const getNavFilters = createSelector(
  [
    getCurrentPage,
    getSelectedContext,
    getLogisticsMapCommodity,
    getLogisticsMapHubsProps,
    getLogisticsMapInspectionLevelProps
  ],
  (
    page,
    selectedContext,
    logisticsMapCommodity,
    logisticsMapsHubs,
    logisticsMapInspectionLevel
  ) => {
    switch (page) {
      case 'logisticsMap':
        return {
          showLogisticsMapDownload: true,
          left: [
            { type: NAV_FILTER_TYPES.dropdown, props: logisticsMapsHubs },
            ...insertIf(logisticsMapInspectionLevel, {
              type: NAV_FILTER_TYPES.dropdown,
              props: logisticsMapInspectionLevel
            })
          ]
        };
      default:
        return {};
    }
  }
);
