import { createReducer } from 'store';
import keyBy from 'lodash/keyBy';
import kebabCase from 'lodash/kebabCase';
import { STATIC_CONTENT__SET_MARKDOWN, STATIC_CONTENT__SET_TEAM } from './static-content.actions';

const initialState = {
  markdown: {
    /**
     * { [filename]: content }
     */
  },
  team: {
    /**
     * { [name]: { name, position, bio, smallImageUrl, staffGroup }
     */
  }
};

const staticContentReducer = {
  [STATIC_CONTENT__SET_MARKDOWN](state, action) {
    const { filename, content } = action.payload;
    return { ...state, markdown: { ...state.markdown, [filename]: content } };
  },
  [STATIC_CONTENT__SET_TEAM](state, action) {
    const { data } = action.payload;
    const team = keyBy(data, t => kebabCase(t.name.split(' ')));
    return { ...state, team };
  }
};

const staticContentReducerTypes = PropTypes => ({
  markdown: PropTypes.object.isRequired
});

export default createReducer(initialState, staticContentReducer, staticContentReducerTypes);
