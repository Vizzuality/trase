import { connect } from 'react-redux';
import { redirect } from 'redux-first-router';
import omit from 'lodash/omit';
import UrlSerializer from './url-serializer.component';

const mapStateToProps = state => ({
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
