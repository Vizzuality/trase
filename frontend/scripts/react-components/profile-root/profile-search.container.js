import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  goToNodeProfilePage,
  searchNodeWithTerm
} from 'react-components/profile-root/profile-root.actions';
import SearchInput from 'react-components/shared/search-input/search-input.component';
import { getSelectedContext } from 'reducers/app.selectors';

function mapStateToProps(state) {
  const selectedContext = getSelectedContext(state);
  const getProfilesContextId = () => {
    if (DISABLE_MULTIPLE_CONTEXT_PROFILES) {
      const singleContextProfile = state.app.contexts.find(
        ctx => ctx.countryName === 'BRAZIL' && ctx.commodityName === 'SOY'
      );

      return singleContextProfile ? singleContextProfile.id : null;
    }

    return selectedContext ? selectedContext.id : null;
  };

  const searchOptions = {
    year: selectedContext ? selectedContext.defaultYear : null,
    contextId: getProfilesContextId()
  };
  return {
    searchOptions,
    items: state.profileRoot.search.results,
    isLoading: state.profileRoot.search.isLoading,
    isDisabled: (searchOptions.year || searchOptions.contextId) === null
  };
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      onSelect: goToNodeProfilePage,
      onSearchTermChange: searchNodeWithTerm
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchInput);
