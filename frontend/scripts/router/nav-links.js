const nav = [
  {
    name: 'Supply Chain',
    page: {
      type: 'tool',
      payload: { serializerParams: { isMapVisible: false } }
    }
  },
  {
    name: 'Map',
    page: {
      type: 'tool',
      payload: { serializerParams: { isMapVisible: true } }
    }
  },
  {
    name: 'Profiles',
    page: 'profileRoot'
  },
  {
    name: 'Yearbook',
    page: `https://yearbook2018.${
      window.location.hostname === 'staging.trase.earth' ? window.location.hostname : 'trase.earth'
    }`,
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
      payload: { section: 'who-is-trase-for' }
    }
  },
  {
    name: 'How does Trase work?',
    page: {
      type: 'about',
      payload: { section: 'how-does-trase-work' }
    }
  },
  {
    name: 'FAQ',
    page: {
      type: 'about',
      payload: { section: 'faq' }
    }
  },
  // {
  //   name: 'Team',
  //   page: 'team'
  // },
  {
    name: 'Partners',
    page: {
      type: 'about',
      payload: { section: 'partners' }
    }
  },
  {
    name: 'Funders',
    page: {
      type: 'about',
      payload: { section: 'funders' }
    }
  },
  {
    name: 'Terms of Use',
    page: {
      type: 'about',
      payload: { section: 'terms-of-use' }
    }
  }
];

if (ENABLE_COOKIE_BANNER) {
  sidebarNav.push(
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
  );
}

if (DISABLE_PROFILES) {
  nav.splice(2, 1);
}

if (ENABLE_DASHBOARDS) {
  nav.splice(-3, 0, {
    name: 'Dashboards',
    page: 'dashboardRoot'
  });
}

if (ENABLE_LOGISTICS_MAP) {
  nav.splice(-4, 0, {
    name: 'Logistics Map',
    page: 'logisticsMap'
  });
}

export default {
  nav,
  sidebarNav
};
