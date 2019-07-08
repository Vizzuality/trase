import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { PROFILE_STEPS } from 'constants';
import 'react-components/shared/profile-selector/profile-panel/profile-panel.scss';
import BlockSwitch from 'react-components/shared/block-switch/block-switch.component';
import Heading from 'react-components/shared/heading';
import ProfilePanelFooter from 'react-components/shared/profile-selector/profile-panel/profile-panel-footer.component';
import CommoditiesPanel from 'react-components/dashboard-element/dashboard-panel/commodities-panel.component';
import isEmpty from 'lodash/isEmpty';
import ProfileStepPanel from 'react-components/shared/profile-selector/profile-panel/profile-step-panel.component';
import getPanelStepName from 'utils/getProfilePanelName';

function ProfilePanel(props) {
  const {
    step,
    setProfilesActiveItem,
    clearProfilesPanel,
    getSearchResults,
    setProfilesSearchResult,
    setProfilesActiveTab,
    getMoreItems,
    profileType,
    blocks,
    onBack,
    onContinue,
    setProfilesPage,
    commoditiesPanel,
    sourcesPanel,
    countriesPanel,
    data,
    tabs,
    loading
  } = props;
  const panels = { countriesPanel, sourcesPanel, commoditiesPanel };
  const isDisabled = useMemo(() => {
    switch (step) {
      case PROFILE_STEPS.types:
        return !profileType;
      case PROFILE_STEPS.profiles: {
        // As we dont have a country profile page the requisite is the sourcesPanel selection
        const panelName = `${profileType}Panel`;
        return panels[panelName] && isEmpty(panels[panelName].activeItems);
      }
      case PROFILE_STEPS.commodities:
        return isEmpty(commoditiesPanel.activeItems);
      default:
        return false;
    }
  }, [profileType, step, commoditiesPanel, panels]);
  switch (step) {
    case PROFILE_STEPS.types:
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
              selectBlock={item => setProfilesActiveItem(item, 'types')}
              activeBlockId={profileType}
            />
          </div>
          <div className="row align-center profile-panel-footer">
            <ProfilePanelFooter onBack={onBack} onContinue={onContinue} isDisabled={isDisabled} />
          </div>
        </div>
      );
    case PROFILE_STEPS.profiles: {
      return (
        <div className="c-profile-panel">
          <Heading align="center" size="md" weight="light">
            Choose the{' '}
            <Heading as="span" size="md" weight="bold">
              {profileType} profile
            </Heading>
          </Heading>
          <div className="row profile-panel-content">
            <ProfileStepPanel
              profileType={profileType}
              panelName={getPanelStepName(step)}
              setProfilesActiveItem={setProfilesActiveItem}
              setProfilesActiveTab={setProfilesActiveTab}
              clearProfilesPanel={clearProfilesPanel}
              getSearchResults={getSearchResults}
              setSearchResult={setProfilesSearchResult}
              getMoreItems={getMoreItems}
              data={data}
              loading={loading}
              tabs={tabs}
              countriesPanel={countriesPanel}
              sourcesPanel={sourcesPanel}
            />
          </div>
          <div className="row align-center profile-panel-footer">
            <ProfilePanelFooter onBack={onBack} onContinue={onContinue} isDisabled={isDisabled} />
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
              page={commoditiesPanel.page}
              getMoreItems={setProfilesPage}
              loadingMoreItems={commoditiesPanel.loadingItems}
              loading={loading}
              commodities={data.commodities}
              onSelectCommodity={item => setProfilesActiveItem(item, 'commodities')}
              activeCommodity={commoditiesPanel.activeItems}
            />
          </div>
          <div className="row align-center profile-panel-footer">
            <ProfilePanelFooter onBack={onBack} onContinue={onContinue} isDisabled={isDisabled} />
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
  clearProfilesPanel: PropTypes.func.isRequired,
  setProfilesActiveTab: PropTypes.func.isRequired,
  getSearchResults: PropTypes.func.isRequired,
  setProfilesSearchResult: PropTypes.func.isRequired,
  getMoreItems: PropTypes.func.isRequired,
  tabs: PropTypes.array,
  profileType: PropTypes.string,
  blocks: PropTypes.array,
  onBack: PropTypes.func,
  onContinue: PropTypes.func.isRequired,
  setProfilesPage: PropTypes.func.isRequired,
  commoditiesPanel: PropTypes.object,
  sourcesPanel: PropTypes.object,
  countriesPanel: PropTypes.object,
  data: PropTypes.object,
  loading: PropTypes.bool
};

export default ProfilePanel;
