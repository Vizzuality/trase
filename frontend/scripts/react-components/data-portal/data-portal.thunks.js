import { loadContext } from 'actions/data.actions';

export const getDataPortalContext = async dispatch => dispatch(loadContext());
