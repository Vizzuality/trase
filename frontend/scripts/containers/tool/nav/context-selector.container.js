import { connect } from 'preact-redux';
import groupBy from 'lodash/groupBy';

import { toggleDropdown } from 'actions/app.actions';
import { selectContext } from 'actions/tool.actions';
import ContextSelector from 'react-components/tool/nav/context-selector.component';

function classifyColumn(classList, { id, label, relation }) {
  const groups = groupBy(classList.map(c => ({ id: c[id], label: c[label], relation: c[relation] })), 'id');
  return Object.values(groups).map(group => group.reduce((acc, next) =>
    Object.assign({}, acc, next, { relation: [...(acc.relation || []), next.relation] }), {})
  );
}

const mapStateToProps = (state) => {

  const getComputedKey = keys => keys.join('_');
  const options = state.tool.contexts.reduce((acc, context) => {
    const computedId = getComputedKey([context.countryId, context.commodityId]);
    return Object.assign({}, acc, { [computedId]: context });
  }, {});

  const commodities = classifyColumn(state.tool.contexts, {
    id: 'commodityId',
    label: 'commodityName',
    relation: 'countryName'
  });
  const countries = classifyColumn(state.tool.contexts, {
    id: 'countryId',
    label: 'countryName',
    relation: 'commodityName'
  });

  return {
    options,
    getComputedKey,
    dimensions: [{ name: 'country', elements: countries, order: 0 }, { name: 'commodity', elements: commodities, order: 1 }],
    tooltips: state.app.tooltips,
    currentDropdown: state.app.currentDropdown,
    selectedContextCountry: state.tool.selectedContext.countryName,
    selectedContextCommodity: state.tool.selectedContext.commodityName
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleContextSelectorVisibility: (id) => {
      dispatch(toggleDropdown(id));
    },
    selectContext: (contextId) => {
      dispatch(selectContext(parseInt(contextId)));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContextSelector);
