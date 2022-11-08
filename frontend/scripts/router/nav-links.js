import { TOOL_LAYOUT } from 'constants';

const supplyChainNavs = [
  {
    name: 'Data Explorer',
    subtitle: 'beta',
    external: true,
    target: '_parent',
    page: 'https://explore.trase.earth/?utm_source=supply-chains-navbar',
    subtitleClassName: 'beta'
  }
];

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
  },
  {
    name: 'About',
    page: 'about'
  }
];

const sidebarNav = [
  {
    name: 'Methods',
    page: {
      type: 'about',
      payload: {
        section: 'methods-and-data'
      }
    }
  },
  {
    name: 'What is <span class="notranslate">Trase</span>?',
    page: {
      type: 'about',
      payload: {
        section: 'what-is-trase'
      }
    }
  }
];

if (DISABLE_PROFILES) {
  nav = nav.filter(route => route.page !== 'profiles');
}

if (!ENABLE_DASHBOARDS) {
  nav = nav.filter(route => route.page !== 'dashboardRoot');
}

export default {
  nav,
  sidebarNav
};
