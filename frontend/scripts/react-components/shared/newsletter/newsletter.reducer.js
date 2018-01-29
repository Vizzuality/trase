import { createReducer } from 'store';
import { NEWSLETTER__SET_SUBSCRIPTION_MESSAGE } from './newsletter.actions';

const initialState = {
  home: {
    message: ''
  }
};

const newsletterReducer = {
  [NEWSLETTER__SET_SUBSCRIPTION_MESSAGE](state, action) {
    const { page, message } = action.payload;
    return { ...state, [page]: { message } };
  }
};

export default createReducer(initialState, newsletterReducer);
