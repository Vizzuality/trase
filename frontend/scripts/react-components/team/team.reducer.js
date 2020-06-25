import kebabCase from 'lodash/kebabCase';
import keyBy from 'lodash/keyBy';
import sortBy from 'lodash/sortBy';
import createReducer from 'utils/createReducer';
import initialState from './team.initial-state';
import { TEAM__SET_CONTENT, TEAM__SET_ERROR_MESSAGE } from './team.actions';

const teamReducer = {
  [TEAM__SET_CONTENT](state, action) {
    const { data } = action.payload;
    const slugifyName = m => kebabCase(m.name.split(' '));
    const members = data
      .map(group =>
        keyBy(
          group.staffMembers.map(m => ({ ...m, group: group.name })),
          slugifyName
        )
      )
      .reduce((acc, next) => ({ ...acc, ...next }), {});

    const groups = sortBy(
      data.map(group => ({
        ...group,
        staffMembers: sortBy(group.staffMembers.map(slugifyName), 'position')
      })),
      'position'
    );
    return { ...state, members, groups };
  },
  [TEAM__SET_ERROR_MESSAGE](state, action) {
    const { errorMessage } = action.payload;
    return { ...state, errorMessage };
  }
};

const teamReducerTypes = PropTypes => ({
  groups: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      position: PropTypes.number,
      staffMembers: PropTypes.array
    })
  ).isRequired,
  members: PropTypes.object.isRequired,
  errorMessage: PropTypes.string
});

export default createReducer(initialState, teamReducer, teamReducerTypes);
