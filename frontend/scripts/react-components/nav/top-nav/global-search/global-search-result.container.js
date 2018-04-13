import GlobalSearchResult from 'react-components/nav/top-nav/global-search/global-search-result.component';
import { connect } from 'react-redux';

const mapStateToProps = state => {
  const { contexts } = state.tool;

  return {
    contexts
  };
};

export default connect(mapStateToProps)(GlobalSearchResult);
