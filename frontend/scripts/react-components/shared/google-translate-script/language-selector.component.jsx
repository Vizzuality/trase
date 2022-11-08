import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import Downshift from 'downshift';
import cx from 'classnames';

// This components shares styles with the transifex selector
import 'scripts/react-components/nav/locale-selector/locale-selector.scss';

function LanguageSelector(props) {
  const onSelectLang = useCallback(
    item => {
      props.onTranslate(item);
    },
    [props]
  );

  const { languages, lang } = props;
  // we use key prop to force re-render.
  // For some reason downshift won't update the selectedItem properly
  return (
    languages.length > 0 && (
      <Downshift key={lang} selectedItem={lang} onChange={onSelectLang}>
        {({ selectedItem, getItemProps, isOpen, getToggleButtonProps, getMenuProps }) => (
          <div className={cx('c-locale-selector', { '-open': isOpen })}>
            <button
              {...getToggleButtonProps({
                className: 'locale-selector-selected-item'
              })}
              translate="no"
            >
              {selectedItem}
            </button>
            {isOpen ? (
              <ul {...getMenuProps({ className: 'locale-selector-menu' })}>
                {languages
                  .filter(l => l !== selectedItem)
                  .map((l, i) => (
                    <li
                      {...getItemProps({
                        item: l,
                        index: i,
                        key: l,
                        className: 'locale-selector-menu-item'
                      })}
                      translate="no"
                    >
                      {l}
                    </li>
                  ))}
              </ul>
            ) : null}
          </div>
        )}
      </Downshift>
    )
  );
}

LanguageSelector.propTypes = {
  lang: PropTypes.string,
  languages: PropTypes.array.isRequired,
  onTranslate: PropTypes.func.isRequired
};

export default LanguageSelector;
