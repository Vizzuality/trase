import { connect } from 'react-redux';
import { redirect } from 'redux-first-router';
import omit from 'lodash/omit';
import UrlSerializer from './url-serializer.component';

export const DONT_SERIALIZE = 'NO_CEREAL_RYAN_GOSLING';

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
