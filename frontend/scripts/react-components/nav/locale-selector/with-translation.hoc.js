import { connect } from 'react-redux';

export default function(Component) {
  const mapStateToProps = state => {
    const { query = {} } = state.location;
    return { lang: query.lang };
  };

  return connect(mapStateToProps)(Component);
}
