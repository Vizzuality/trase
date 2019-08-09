import React from 'react';
import PropTypes from 'prop-types';
import { PROFILE_STEPS } from 'constants';
import 'react-components/shared/profile-selector/profile-panel/profile-panel.scss';
import BlockSwitch from 'react-components/shared/block-switch/block-switch.component';
import Heading from 'react-components/shared/heading';
import CommoditiesPanel from 'react-components/dashboard-element/dashboard-panel/commodities-panel.component';
import ProfileStepPanel from 'react-components/shared/profile-selector/profile-panel/profile-step-panel';
import getPanelStepName from 'utils/getProfilePanelName';

function ProfilePanel(props) {
  const {
    step,
    setProfilesActiveItem,
    profileType,
    blocks,
    setProfilesPage,
    panels,
    data,
    loading
  } = props;
  const singularTypes = {
    sources: 'Source',
    'importing countries': 'Importing country',
    traders: 'Trader'
  };
  switch (step) {
    case PROFILE_STEPS.type:
      return (
        <div className="c-profile-panel">
          <Heading align="center" size="md" weight="light">
            Choose the{' '}
            <Heading as="span" size="md" weight="bold">
              type of profile
            </Heading>
          </Heading>
          <div className="row profile-panel-content">
            <BlockSwitch
              blocks={blocks}
              selectBlock={item => setProfilesActiveItem(item, 'type')}
              activeBlockId={profileType}
            />
          </div>
        </div>
      );
    case PROFILE_STEPS.profiles: {
      return (
        <div className="c-profile-panel">
          <Heading align="center" size="md" weight="light">
            Choose the{' '}
            <Heading as="span" size="md" weight="bold">
              {singularTypes[profileType]} profile
            </Heading>
          </Heading>
          <div className="row profile-panel-content">
            <ProfileStepPanel panelName={getPanelStepName(step)} />
          </div>
        </div>
      );
    }
    case PROFILE_STEPS.commodities:
      return (
        <div className="c-profile-panel">
          <Heading align="center" size="md" weight="light">
            Choose one
            <Heading as="span" size="md" weight="bold">
              {' '}
              commodity
            </Heading>
          </Heading>
          <div className="row profile-panel-content">
            <CommoditiesPanel
              page={panels.commodities.page}
              getMoreItems={setProfilesPage}
              loadingMoreItems={panels.commodities.loadingItems}
              loading={loading}
              commodities={data.commodities}
              onSelectCommodity={item => setProfilesActiveItem(item, 'commodities')}
              activeCommodities={panels.commodities.activeItems}
            />
          </div>
        </div>
      );
    default:
      return null;
  }
}

ProfilePanel.propTypes = {
  step: PropTypes.number,
  setProfilesActiveItem: PropTypes.func.isRequired,
  profileType: PropTypes.string,
  blocks: PropTypes.array,
  setProfilesPage: PropTypes.func.isRequired,
  panels: PropTypes.object,
  data: PropTypes.object,
  loading: PropTypes.bool
};

export default ProfilePanel;
