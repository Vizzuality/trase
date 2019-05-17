import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import Downshift from 'downshift';
import cx from 'classnames';

import 'scripts/react-components/nav/locale-selector/locale-selector.scss';

function LocaleSelector(props) {
  useEffect(() => {
    if (props.lang !== null) {
      if (typeof window.Transifex !== 'undefined' && props.lang?.code) {
        window.Transifex.live.translateTo(props.lang.code);
      }
    }
  }, [props.lang]);

  const onSelectLang = useCallback(
    item => {
      props.onTranslate(item.code);
    },
    [props]
  );

  const { languages, lang } = props;
  // we use key prop to force re-render.
  // For some reason downshift won't update the selectedItem properly
  return (
    languages.length > 0 && (
      <Downshift
        key={lang.code}
        selectedItem={lang}
        itemToString={i => i?.code}
        onChange={onSelectLang}
      >
        {({ selectedItem, getItemProps, isOpen, getToggleButtonProps, getMenuProps }) => (
          <div className={cx('c-locale-selector', { '-open': isOpen })}>
            <button
              {...getToggleButtonProps({
                className: 'locale-selector-selected-item'
              })}
            >
              {selectedItem?.code}
            </button>
            {isOpen ? (
              <ul {...getMenuProps({ className: 'locale-selector-menu' })}>
                {languages
                  .filter(l => l.code !== selectedItem?.code)
                  .map((l, i) => (
                    <li
                      {...getItemProps({
                        item: l,
                        index: i,
                        key: l.code,
                        className: 'locale-selector-menu-item'
                      })}
                    >
                      {l.code}
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

LocaleSelector.propTypes = {
  lang: PropTypes.object,
  languages: PropTypes.array.isRequired,
  onTranslate: PropTypes.func.isRequired
};

export default LocaleSelector;
