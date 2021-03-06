import { connect } from 'react-redux';
import ProfilePanelComponent from 'react-components/shared/profile-selector/profile-panel/profile-panel.component';
import { PROFILE_TYPES } from 'constants';
import { profileSelectorActions } from 'react-components/shared/profile-selector/profile-selector.register';

const getBlocks = () => {
  const blocks = [
    {
      id: PROFILE_TYPES.sources,
      title: 'sources',
      imageUrl: '/images/dashboards/icon_sourcing.svg',
      whiteImageUrl: '/images/dashboards/icon_sourcing_white.svg'
    },
    {
      id: PROFILE_TYPES.traders,
      title: 'traders',
      imageUrl: '/images/dashboards/icon_companies.svg',
      whiteImageUrl: '/images/dashboards/icon_companies_white.svg'
    }
  ];
  if (ENABLE_COUNTRY_PROFILES) {
    const importingCountries = {
      id: PROFILE_TYPES.importing,
      title: 'importer countries',
      imageUrl: '/images/dashboards/icon_importing.svg',
      whiteImageUrl: '/images/dashboards/icon_importing_white.svg'
    };
    blocks.splice(1, 0, importingCountries);
  }
  return blocks;
}

const mapStateToProps = state => ({
  profileType: state.profileSelector.panels.type,
  blocks: getBlocks(),
  panels: state.profileSelector.panels,
  data: state.profileSelector.data,
  loading: state.profileSelector.loading
});

const mapDispatchToProps = {
  setProfilesActiveItem: profileSelectorActions.setProfilesActiveItem,
  setProfilesPage: profileSelectorActions.setProfilesPage
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePanelComponent);
