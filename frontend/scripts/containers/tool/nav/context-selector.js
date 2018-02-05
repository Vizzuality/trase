import { connect } from 'react-redux';
import groupBy from 'lodash/groupBy';

import { toggleDropdown } from 'actions/app.actions';
import { selectContext } from 'actions/tool.actions';
import ContextSelector from 'react-components/tool/nav/context-selector';

function classifyColumn(contexts, { id, label, relation }) {
  const groups = groupBy(
    contexts.map(context => {
      const group = { id: context[id], label: context[label], relation: {} };
      const relationKey = context[relation];
      group.relation[relationKey] = { isSubnational: context.isSubnational };
      return group;
    }),
    'id'
  );

  return Object.values(groups).map(group =>
    group.reduce((acc, next) => {
      const newRelation = Object.assign({}, acc.relation, next.relation);
      return Object.assign({}, acc, next, { relation: newRelation });
    }, {})
  );
}

const mapStateToProps = state => {
  const getComputedKey = keys => keys.join('_');
  const contexts = state.tool.contexts.reduce((acc, context) => {
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
    contexts,
    getComputedKey,
    dimensions: [
      { name: 'country', elements: countries, order: 0 },
      {
        name: 'commodity',
        elements: commodities,
        order: 1
      }
    ],
    tooltips: state.app.tooltips,
    currentDropdown: state.app.currentDropdown,
    selectedContextCountry: state.tool.selectedContext.countryName,
    selectedContextCommodity: state.tool.selectedContext.commodityName
  };
};

const mapDispatchToProps = dispatch => ({
  toggleContextSelectorVisibility: id => {
    dispatch(toggleDropdown(id));
  },
  selectContext: contextId => {
    dispatch(selectContext(parseInt(contextId, 10)));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ContextSelector);
