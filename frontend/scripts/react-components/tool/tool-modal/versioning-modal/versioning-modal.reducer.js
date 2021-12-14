import createReducer from 'utils/createReducer';
import immer from 'immer';
import initialState from './versioning-modal.initial-state';

import { VERSIONING_MODAL__SET_METHODS_AND_DATA_URL } from './versioning-modal.actions';

export const defaultEndpoint = key => ({
  data: null,
  loading: true,
  error: null,
  key
});

const methodsAndDataReducer = {
  [VERSIONING_MODAL__SET_METHODS_AND_DATA_URL](state, action) {
    return immer(state, draft => {
      draft.data = action.payload;
    });
  }
};

const methodsAndDataReducerTypes = PropTypes => ({
  data: PropTypes.objectOf(
    PropTypes.shape({
      error: PropTypes.any,
      key: PropTypes.string.isRequired,
      data: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
      loading: PropTypes.bool.isRequired
    })
  ).isRequired
});

export default createReducer(initialState, methodsAndDataReducer, methodsAndDataReducerTypes);
