export default {
  nav: [
    {
      name: 'Supply Chain',
      page: 'tool'
    },
    {
      name: 'Map',
      page: {
        type: 'tool',
        payload: { query: { state: { isMapVisible: true } } }
      }
    },
    {
      name: 'Profiles',
      page: 'profileRoot'
    },
    {
      name: 'Download',
      page: 'data'
    },
    {
      name: 'About',
      page: 'about'
    }
  ],
  sidebarNav: [
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
  ]
};
