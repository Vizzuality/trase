import { SET_NODE_ATTRIBUTES } from 'react-components/tool/tool.actions';
import reducer from 'react-components/tool-links/tool-links.reducer';
import initialState from 'react-components/tool-links/tool-links.initial-state';

describe(SET_NODE_ATTRIBUTES, () => {
  it('adds node attributes', () => {
    const attributes = [
      { node_id: 1, attribute_id: 'SOY_DEFORESTATION', attribute_type: 'quant' },
      { node_id: 1, attribute_id: 'SMALLHOLDER_DOMINANCE', attribute_type: 'ind' },
      { node_id: 2, attribute_id: 'SMALLHOLDER_DOMINANCE', attribute_type: 'ind' },
      { node_id: 3, attribute_id: 'SMALLHOLDER_DOMINANCE', attribute_type: 'ind' }
    ];
    const action = {
      type: SET_NODE_ATTRIBUTES,
      payload: { data: attributes }
    };
    const newState = reducer(initialState, action);
    expect(newState).toMatchSnapshot();
  });

  it('removes node attributes', () => {
    const state = {
      ...initialState,
      data: {
        ...initialState.data,
        nodeAttributes: {}
      }
    };
    const action = {
      type: SET_NODE_ATTRIBUTES,
      payload: { data: [] }
    };
    const newState = reducer(state, action);
    expect(newState).toMatchSnapshot();
  });
});
