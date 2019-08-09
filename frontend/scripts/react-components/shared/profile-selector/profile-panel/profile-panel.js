import { connect } from 'react-redux';
import ProfilePanelComponent from 'react-components/shared/profile-selector/profile-panel/profile-panel.component';
import { PROFILE_TYPES } from 'constants';
import {
  setProfilesPage,
  setProfilesActiveItem
} from 'react-components/shared/profile-selector/profile-selector.actions';

// Importing countries panel is not ready yet
const blocks = [
  {
    id: PROFILE_TYPES.sources,
    title: 'sources',
    imageUrl: '/images/dashboards/icon_sourcing.svg',
    whiteImageUrl: '/images/dashboards/icon_sourcing_white.svg'
  },
  // {
  //   id: PROFILE_TYPES.importing,
  //   title: 'importing countries',
  //   imageUrl: '/images/dashboards/icon_importing.svg',
  //   whiteImageUrl: '/images/dashboards/icon_importing_white.svg'
  // },
  {
    id: PROFILE_TYPES.traders,
    title: 'traders',
    imageUrl: '/images/dashboards/icon_companies.svg',
    whiteImageUrl: '/images/dashboards/icon_companies_white.svg'
  }
];

const mapStateToProps = state => ({
  profileType: state.profileSelector.panels.type,
  blocks,
  panels: state.profileSelector.panels,
  data: state.profileSelector.data,
  loading: state.profileSelector.loading
});

const mapDispatchToProps = {
  setProfilesActiveItem,
  setProfilesPage
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfilePanelComponent);
