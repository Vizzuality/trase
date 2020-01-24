import { connect } from 'react-redux';
import { setLanguage } from 'app/app.register';
import LocaleSelector from './locale-selector.component';

const mapStateToProps = state => {
  const { query: { lang } = {} } = state.location;
  const { languages } = state.app;
  const urlLang = languages.find(l => l.code === lang);
  const sourceLang = languages.find(l => l.source);
  return {
    languages,
    lang: urlLang || sourceLang || null
  };
};

const mapDispatchToProps = { onTranslate: setLanguage };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LocaleSelector);
