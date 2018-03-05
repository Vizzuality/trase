import { connect } from 'react-redux';
import groupBy from 'lodash/groupBy';
import memoize from 'lodash/memoize';
import { toggleDropdown } from 'actions/app.actions';
import ContextSelector from 'react-components/shared/context-selector/context-selector.component';

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

const memoizedClassifyColumn = memoize(
  classifyColumn,
  (ctx, params) => Object.values(params).join('-') + ctx.length
);

const getComputedKey = keys => keys.join('_');

const mapStateToProps = state => {
  const contexts = state.tool.contexts.reduce((acc, context) => {
    const computedId = getComputedKey([context.countryId, context.commodityId]);
    return Object.assign({}, acc, { [computedId]: context });
  }, {});

  const commodities = memoizedClassifyColumn(state.tool.contexts, {
    id: 'commodityId',
    label: 'commodityName',
    relation: 'countryName'
  });
  const countries = memoizedClassifyColumn(state.tool.contexts, {
    id: 'countryId',
    label: 'countryName',
    relation: 'commodityName'
  });

  const { tooltips, currentDropdown } = state.app;
  const { selectedContext } = state.tool;

  return {
    contexts,
    tooltipText: tooltips && tooltips.sankey.nav.main,
    getComputedKey,
    currentDropdown,
    dimensions: [
      { name: 'country', elements: countries, order: 0 },
      {
        name: 'commodity',
        elements: commodities,
        order: 1
      }
    ],
    selectedContextCountry: selectedContext && selectedContext.countryName,
    selectedContextCommodity: selectedContext && selectedContext.commodityName
  };
};

const mapDispatchToProps = dispatch => ({
  toggleContextSelectorVisibility: id => {
    dispatch(toggleDropdown(id));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ContextSelector);
