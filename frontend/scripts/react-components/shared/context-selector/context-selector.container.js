import { connect } from 'react-redux';
import { toggleDropdown, selectContextById } from 'actions/app.actions';
import ContextSelector from 'react-components/shared/context-selector/context-selector.component';

const mapStateToProps = (state, ownProps) => {
  const { selectedContext, selectContexts = i => i } = ownProps;
  const { contexts, tooltips, currentDropdown, contextIsUserSelected } = state.app;
  const { type } = state.location;
  const selectedContextCountry = selectedContext && selectedContext.countryName;
  const selectedContextCommodity = selectedContext && selectedContext.commodityName;
  const isExplore = type === 'explore';
  const isContextSelected =
    (!isExplore || contextIsUserSelected) && !!selectedContextCountry && !!selectedContextCommodity;
  const contextLabel =
    isContextSelected &&
    `${selectedContextCountry.toLowerCase()} - ${selectedContextCommodity.toLowerCase()}`;
  return {
    currentDropdown,
    isContextSelected,
    contextIsUserSelected,
    contexts: selectContexts(contexts || []),
    contextLabel: contextLabel || undefined,
    tooltipText: tooltips && tooltips.sankey.nav.context.main
  };
};

const mapDispatchToProps = dispatch => ({
  selectContextById: selectedContextId => dispatch(selectContextById(selectedContextId)),
  toggleContextSelectorVisibility: id => {
    dispatch(toggleDropdown(id));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContextSelector);
