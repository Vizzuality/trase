import { TOOL_LAYOUT } from 'constants';

const supplyChainNavs = [];
if (ENABLE_TOOL_PANEL) {
  supplyChainNavs.push({
    name: 'Data Tools',
    page: {
      type: 'explore'
    }
  });
} else {
  supplyChainNavs.push(
    {
      name: 'Supply Chain',
      page: {
        type: 'tool',
        payload: {
          serializerParams: {
            toolLayout: TOOL_LAYOUT.splitted
          }
        }
      }
    },
    {
      name: 'Map',
      page: {
        type: 'tool',
        payload: {
          serializerParams: {
            toolLayout: TOOL_LAYOUT.left
          }
        }
      }
    }
  );
}

let nav = [
  ...supplyChainNavs,
  {
    name: 'Profiles',
    page: 'profiles'
  },
  {
    name: 'Logistics Map',
    page: 'logisticsMap'
  },
  {
    name: 'Download',
    page: 'data'
  }
];

if (DISABLE_PROFILES) {
  nav = nav.filter(route => route.page !== 'profiles');
}

if (!ENABLE_DASHBOARDS) {
  nav = nav.filter(route => route.page !== 'dashboardRoot');
}

export default {
  nav
};
