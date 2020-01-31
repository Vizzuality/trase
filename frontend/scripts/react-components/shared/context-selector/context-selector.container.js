import { connect } from 'react-redux';
import { appActions } from 'app/app.register';
import ContextSelector from 'react-components/shared/context-selector/context-selector.component';

const mapStateToProps = (state, ownProps) => {
  const { selectedContext, selectContexts = i => i } = ownProps;
  const { contexts, tooltips, currentDropdown } = state.app;
  const selectorContexts = selectContexts(contexts || []);

  const selectedContextCountry = selectedContext && selectedContext.countryName;
  const selectedContextCommodity = selectedContext && selectedContext.commodityName;
  const isContextSelected = !!selectedContextCountry && !!selectedContextCommodity;
  const contextLabel =
    isContextSelected &&
    `${selectedContextCountry.toLowerCase()} - ${selectedContextCommodity.toLowerCase()}`;

  return {
    currentDropdown,
    isContextSelected,
    contexts: selectorContexts,
    contextLabel: contextLabel || undefined,
    tooltipText: tooltips && tooltips.sankey.nav.context.main
  };
};

const mapDispatchToProps = dispatch => ({
  selectContextById: selectedContextId => dispatch(appActions.selectContextById(selectedContextId)),
  toggleContextSelectorVisibility: id => {
    dispatch(appActions.toggleDropdown(id));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ContextSelector);
