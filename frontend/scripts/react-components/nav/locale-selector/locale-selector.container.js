import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { setLanguage } from 'scripts/actions/app.actions';
import LocaleSelector from './locale-selector.component';

const mapStateToProps = state => {
  const { query: { lang } = {} } = state.location;
  return { urlLang: lang };
};

const mapDispatchToProps = dispatch => bindActionCreators({ onTranslate: setLanguage }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LocaleSelector);
