import React from 'react';
import PropTypes from 'prop-types';
import Downshift from 'downshift';
import cx from 'classnames';

const { Transifex } = window;

class LocaleSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      languages: []
    };

    this.onSelectLang = this.onSelectLang.bind(this);
    this.getDefaultLanguage = this.getDefaultLanguage.bind(this);
    this.setLanguages = this.setLanguages.bind(this);
  }

  componentDidMount() {
    this.setLanguages();
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

  getDefaultLanguage() {
    const { languages } = this.state;
    if (typeof Transifex !== 'undefined') {
      const code = Transifex.live.detectLanguage();
      return languages.find(lang => lang.code === code) || { code };
    }
    return languages.find(lang => lang.source);
  }

  setLanguages() {
    if (typeof Transifex !== 'undefined') {
      const languages = Transifex.live.getAllLanguages() || [];
      this.setState({ languages });
    }
  }

  render() {
    const { languages } = this.state;
    const defaultLang = this.getDefaultLanguage();

    return (
      languages.length > 0 && (
        <Downshift defaultSelectedItem={defaultLang}>
          {({ getItemProps, isOpen, toggleMenu, selectedItem, getButtonProps }) => (
            <div className={cx('c-locale-selector', { '-open': isOpen })}>
              <button
                {...getButtonProps()}
                className="locale-selector-selected-item"
                onClick={toggleMenu}
              >
                {selectedItem.code}
              </button>
              {isOpen ? (
                <ul className="locale-selector-menu">
                  {languages.filter(lang => lang.code !== selectedItem.code).map(lang => {
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
  onTranslate: PropTypes.func
};

LocaleSelector.defaultProps = {
  onTranslate: () => {}
};

export default LocaleSelector;
