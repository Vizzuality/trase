import { connect } from 'react-redux';
import { redirect } from 'redux-first-router';
import UrlSerializer from './url-serializer.component';

const mapStateToProps = state => ({
  query: state.location.query
});

const serializer = (query, urlProps) => (dispatch, getState) => {
  const {
    location: { type }
  } = getState();
  dispatch(
    redirect({
      type,
      payload: {
        query: { ...query, ...urlProps }
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
