import { connect } from 'react-redux';
import { toggleDropdown, selectContextById } from 'actions/app.actions';
import ContextSelector from 'react-components/shared/context-selector/context-selector.component';

const mapStateToProps = state => {
  const { contexts, tooltips, currentDropdown, selectedContext, contextIsUserSelected } = state.app;

  return {
    contexts: contexts || [],
    tooltipText: tooltips && tooltips.sankey.nav.context.main,
    currentDropdown,
    contextIsUserSelected,
    selectedContextCountry: selectedContext && selectedContext.countryName,
    selectedContextCommodity: selectedContext && selectedContext.commodityName
  };
};

const mapDispatchToProps = dispatch => ({
  selectContextById: selectedContextId => dispatch(selectContextById(selectedContextId)),
  toggleContextSelectorVisibility: id => {
    dispatch(toggleDropdown(id));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ContextSelector);
