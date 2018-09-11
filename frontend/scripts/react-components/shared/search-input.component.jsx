import React from 'react';
import PropTypes from 'prop-types';
import Downshift from 'downshift';
import cx from 'classnames';

function SearchInput(props) {
  const { items, placeholder } = props;

  return (
    <Downshift
      onChange={selection => alert(`You selected ${selection.value}`)}
      itemToString={item => (item ? item.value : '')}
    >
      {({ getInputProps, getMenuProps, getItemProps, isOpen, inputValue, highlightedIndex }) => (
        <div className="c-search-input">
          <div className="search-input-bar">
            <label htmlFor={`search-input-${placeholder}`}>
              <svg className="icon icon-search">
                <use xlinkHref="#icon-search" />
              </svg>
            </label>
            <input
              {...getInputProps({ placeholder, id: `search-input-${placeholder}` })}
              type="search"
            />
          </div>
          <ul {...getMenuProps()}>
            {isOpen
              ? items
                  .filter(item => !inputValue || item.value.includes(inputValue))
                  .map((item, index) => (
                    <li
                      {...getItemProps({
                        key: item.value,
                        index,
                        item
                      })}
                      className={cx('search-input-result', {
                        '-highlighted': highlightedIndex === index
                      })}
                    >
                      {item.value}
                    </li>
                  ))
              : null}
          </ul>
        </div>
      )}
    </Downshift>
  );
}

SearchInput.propTypes = {
  placeholder: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.shape({ value: PropTypes.any.isRequired }))
};

export default SearchInput;
