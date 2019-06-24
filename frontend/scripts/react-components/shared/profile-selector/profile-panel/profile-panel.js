import { connect } from 'react-redux';
import ProfilePanelComponent from 'react-components/shared/profile-selector/profile-panel/profile-panel.component';
import { setProfilesProfileType } from 'react-components/shared/profile-selector/profile-selector.actions';

const blocks = [
  {
    id: 'sources',
    title: 'sources',
    imageUrl: '/images/dashboards/icon_sourcing.svg',
    whiteImageUrl: '/images/dashboards/icon_sourcing_white.svg'
  },
  {
    id: 'importing-countries',
    title: 'importing countries',
    imageUrl: '/images/dashboards/icon_importing.svg',
    whiteImageUrl: '/images/dashboards/icon_importing_white.svg'
  },
  {
    id: 'traders',
    title: 'traders',
    imageUrl: '/images/dashboards/icon_companies.svg',
    whiteImageUrl: '/images/dashboards/icon_companies_white.svg'
  }
];

const mapStateToProps = state => ({
  profileType: state.profileSelector.activeProfileType,
  blocks
});

const mapDispatchToProps = {
  setProfileType: setProfilesProfileType
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfilePanelComponent);
