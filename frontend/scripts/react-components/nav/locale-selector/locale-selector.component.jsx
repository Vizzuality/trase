import React from 'react';
import Downshift from 'downshift';
import cx from 'classnames';

const { Transifex } = window;

class LocaleSelector extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      languages: [
        {
          name: 'English',
          code: 'en',
          source: true
        }
      ]
    };
  }

  componentDidMount() {
    if (typeof Transifex !== 'undefined') {
      Transifex.live.onFetchLanguages(languages => this.setState({ languages }));
    }
  }

  render() {
    const { languages } = this.state;
    return (
      <Downshift defaultSelectedItem={languages[0]}>
        {({ getItemProps, isOpen, toggleMenu, selectedItem }) => (
          <div className={cx('c-locale-selector', { '-open': isOpen })}>
            <button className="locale-selector-selected-item" onClick={toggleMenu}>
              {selectedItem ? selectedItem.code : null}
            </button>
            {isOpen ? (
              <ul className="locale-selector-menu">
                {languages.filter(lang => lang.code !== selectedItem.code).map(lang => (
                  <li
                    {...getItemProps({ item: lang })}
                    key={lang.code}
                    className="locale-selector-menu-item"
                  >
                    {lang.code}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        )}
      </Downshift>
    );
  }
}

export default LocaleSelector;
