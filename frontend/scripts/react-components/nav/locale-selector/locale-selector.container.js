import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { setLanguage } from 'scripts/actions/app.actions';
import LocaleSelector from './locale-selector.component';

const mapStateToProps = state => ({ urlLang: state.app.languageCode });

const mapDispatchToProps = dispatch => bindActionCreators({ onTranslate: setLanguage }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(LocaleSelector);
