import { createReducer } from 'store';
import keyBy from 'lodash/keyBy';
import kebabCase from 'lodash/kebabCase';
import sortBy from 'lodash/sortBy';
import { STATIC_CONTENT__SET_MARKDOWN, STATIC_CONTENT__SET_TEAM } from './static-content.actions';

const initialState = {
  markdown: {
    /**
     * { [filename]: content }
     */
  },
  team: {
    groups: null,
    /**
     * { [name]: { name, position, staffMembers }
     */
    members: null
    /**
     * { [name]: { name, position, bio, smallImageUrl }
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
    const slugifyName = m => kebabCase(m.name.split(' '));
    const members = data
      .map(group => keyBy(group.staffMembers.map(m => ({ ...m, group: group.name })), slugifyName))
      .reduce((acc, next) => ({ ...acc, ...next }), {});

    const groups = sortBy(
      data.map(group => ({
        ...group,
        staffMembers: sortBy(group.staffMembers.map(slugifyName), 'position')
      })),
      'position'
    );
    return { ...state, team: { members, groups } };
  }
};

const staticContentReducerTypes = PropTypes => ({
  markdown: PropTypes.object.isRequired
});

export default createReducer(initialState, staticContentReducer, staticContentReducerTypes);
