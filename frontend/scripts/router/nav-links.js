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
  !ENABLE_TOP_NAV_REDESIGN && {
    name: 'Dashboards',
    page: 'dashboardRoot'
  },
  {
    name: 'Logistics Map',
    page: 'logisticsMap'
  },
  !ENABLE_TOP_NAV_REDESIGN && {
    name: 'Finance',
    page: 'https://trase.finance',
    external: true
  },
  !ENABLE_TOP_NAV_REDESIGN && {
    name: 'Insights',
    page: 'https://insights.trase.earth',
    external: true
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
    name: 'What is Trase?',
    page: 'about'
  },
  {
    name: 'Who is Trase for?',
    page: {
      type: 'about',
      payload: {
        section: 'who-is-trase-for'
      }
    }
  },
  {
    name: 'Methods and data',
    page: {
      type: 'about',
      payload: {
        section: 'methods-and-data'
      }
    }
  },
  {
    name: 'FAQ',
    page: {
      type: 'about',
      payload: {
        section: 'faq'
      }
    }
  },
  {
    name: 'Partners',
    page: {
      type: 'about',
      payload: {
        section: 'partners'
      }
    }
  },
  {
    name: 'Funders',
    page: {
      type: 'about',
      payload: {
        section: 'funders'
      }
    }
  },
  {
    name: 'Terms of Use',
    page: {
      type: 'about',
      payload: {
        section: 'terms-of-use'
      }
    }
  },
  {
    name: 'Privacy policy',
    page: {
      type: 'about',
      payload: {
        section: 'privacy-policy'
      }
    }
  },
  {
    name: 'Cookie policy',
    page: {
      type: 'about',
      payload: {
        section: 'cookie-policy'
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
