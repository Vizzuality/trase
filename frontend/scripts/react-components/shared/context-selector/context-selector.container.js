import { connect } from 'react-redux';
import { toggleDropdown, selectContextById } from 'actions/app.actions';
import ContextSelector from 'react-components/shared/context-selector/context-selector.component';

const getComputedKey = keys => keys.join('_');

const mapStateToProps = state => {
  const contexts = state.app.contexts.reduce((acc, context) => {
    const computedId = getComputedKey([context.countryId, context.commodityId]);
    return Object.assign({}, acc, { [computedId]: context });
  }, {});

  const { tooltips, currentDropdown, selectedContext } = state.app;

  return {
    contexts,
    contextIsUserSelected: state.app.contextIsUserSelected,
    tooltipText: tooltips && tooltips.sankey.nav.context.main,
    getComputedKey,
    currentDropdown,
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
