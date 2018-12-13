import React from 'react';
import PropTypes from 'prop-types';
import Downshift from 'downshift';
import cx from 'classnames';

import 'scripts/react-components/nav/locale-selector/locale-selector.scss';

const { Transifex } = window;

class LocaleSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      languages: [],
      defaultLanguage: null
    };

    this.onSelectLang = this.onSelectLang.bind(this);
    this.setDefaultLanguage = this.setDefaultLanguage.bind(this);
    this.setLanguages = this.setLanguages.bind(this);
  }

  componentDidMount() {
    this.setLanguages();
    this.setDefaultLanguage();
  }

  componentDidUpdate(prevProps, prevState) {
    const { defaultLanguage } = this.state;
    if (defaultLanguage && prevState.defaultLanguage === null && defaultLanguage !== null) {
      this.props.onTranslate(defaultLanguage.code);
    }
  }

  onSelectLang(item, callback) {
    if (typeof Transifex !== 'undefined') {
      Transifex.live.translateTo(item.code);
      this.props.onTranslate(item.code);
    }
    // We call item's onClick to update Downshift's inner state after performing our custom logic.
    // Normal approach would be to let the user click-trigger onClick and use Downshift onChange
    // to perform translations. But this is not working correctly.
    callback();
  }

  setDefaultLanguage() {
    const { languages } = this.state;
    const { urlLang } = this.props;
    let defaultLanguage = null;
    const urlLanguage = urlLang && languages.find(lang => lang.code === urlLang);

    if (urlLanguage) {
      defaultLanguage = urlLanguage;
    } else if (typeof Transifex !== 'undefined') {
      const code = Transifex.live.detectLanguage();
      defaultLanguage = languages.find(lang => lang.code === code) || { code };
    } else {
      defaultLanguage = languages.find(lang => lang.source);
    }

    this.setState({ defaultLanguage });
  }

  setLanguages() {
    if (typeof Transifex !== 'undefined') {
      const languages = Transifex.live.getAllLanguages() || [];
      this.setState({ languages });
    }
  }

  render() {
    const { languages, defaultLanguage } = this.state;

    return (
      languages.length > 0 && (
        <Downshift defaultSelectedItem={defaultLanguage} itemToString={i => i.code}>
          {({ getItemProps, isOpen, toggleMenu, selectedItem, getToggleButtonProps }) => (
            <div className={cx('c-locale-selector', { '-open': isOpen })}>
              <button
                {...getToggleButtonProps()}
                className="locale-selector-selected-item"
                onClick={toggleMenu}
              >
                {selectedItem.code}
              </button>
              {isOpen ? (
                <ul className="locale-selector-menu">
                  {languages
                    .filter(lang => lang.code !== selectedItem.code)
                    .map(lang => {
                      /* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
                      // Downshift onChange makes weird stuff, pass downshift onClick as cb instead
                      const { onClick, ...itemProps } = getItemProps({ item: lang });
                      return (
                        <li
                          {...itemProps}
                          key={lang.code}
                          className="locale-selector-menu-item"
                          onClick={e => this.onSelectLang(lang, () => onClick(e))}
                        >
                          {lang.code}
                        </li>
                      );
                      /* eslint-enable */
                    })}
                </ul>
              ) : null}
            </div>
          )}
        </Downshift>
      )
    );
  }
}

LocaleSelector.propTypes = {
  onTranslate: PropTypes.func,
  urlLang: PropTypes.string
};

LocaleSelector.defaultProps = {
  onTranslate: () => {},
  urlLang: 'en'
};

export default LocaleSelector;
