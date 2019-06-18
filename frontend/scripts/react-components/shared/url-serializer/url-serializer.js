import { connect } from 'react-redux';
import { redirect } from 'redux-first-router';
import omit from 'lodash/omit';
import UrlSerializer from './url-serializer.component';

export const DONT_SERIALIZE = 'NO_CEREAL_RYAN_GOSLING';

export const deserialize = ({ props, params, initialState = {}, urlPropHandlers = {} }) =>
  props.reduce((acc, prop) => {
    const getParsedValue = urlPropHandlers[prop] ? urlPropHandlers[prop].parse : x => x;
    return {
      ...acc,
      [prop]:
        typeof params[prop] !== 'undefined'
          ? getParsedValue(params[prop], DONT_SERIALIZE)
          : initialState[prop]
    };
  }, initialState);

const mapStateToProps = state => ({
  DONT_SERIALIZE,
  query: state.location.query
});

const serializer = (query, urlProps, removedProps = []) => (dispatch, getState) => {
  const {
    location: { type }
  } = getState();
  dispatch(
    redirect({
      type,
      payload: {
        query: omit({ ...query, ...urlProps }, removedProps)
      }
    })
  );
};

const mapDispatchToProps = {
  serializer
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UrlSerializer);
