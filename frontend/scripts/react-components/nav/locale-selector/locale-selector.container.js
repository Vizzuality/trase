import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { setLocaleCode } from './locale-selector.actions';
import LocaleSelector from './locale-selector.component';

const mapStateToProps = state => {
  const { query = {} } = state.location;
  return { urlLang: query.lang };
};

const mapDispatchToProps = dispatch => bindActionCreators({ onTranslate: setLocaleCode }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(LocaleSelector);
