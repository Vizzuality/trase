/* eslint-disable jsx-a11y/role-has-required-aria-props */
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { ImgBackground } from 'react-components/shared/img/img';
import Text from 'react-components/shared/text';
import Icon from 'react-components/shared/icon';
import cx from 'classnames';

import './basemaps.scss';

function Basemaps(props) {
  const { activeBasemapId, basemaps, selectBasemap } = props;
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  useEffect(() => {
    const box = containerRef.current;
    const onClickOutside = e => {
      if (!box) {
        return;
      }
      if (!box.contains(e.target)) {
        setOpen(false);
      }
    };
    window.addEventListener('click', onClickOutside);
    return () => {
      window.removeEventListener('click', onClickOutside);
    };
  }, [setOpen]);

  return (
    <div
      ref={containerRef}
      className={cx('c-basemaps', { '-open': open })}
      role="combobox"
      aria-haspopup="listbox"
      aria-expanded="true"
      aria-owns="basemaps-menu"
    >
      <button onClick={() => setOpen(_open => !_open)} className="basemaps-toggle">
        <Icon icon="icon-basemaps" color="grey" />
      </button>
      <ul className="basemaps-list" role="listbox" id="basemap-menu">
        {basemaps.map(basemap => (
          <li
            role="option"
            aria-selected={activeBasemapId === basemap.id ? 'true' : 'false'}
            className={cx('basemap-item', {
              '-active': activeBasemapId === basemap.id
            })}
          >
            <button
              type="button"
              className="basemap-item-button"
              disabled={activeBasemapId === basemap.id}
              onClick={() => selectBasemap(basemap.id)}
            >
              <ImgBackground src={basemap.thumbnail} className="basemap-thumb" />
              <Text variant="mono" transform="uppercase" weight="light" className="basemap-title">
                {basemap.title}
              </Text>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

Basemaps.propTypes = {
  basemaps: PropTypes.array,
  selectBasemap: PropTypes.func,
  activeBasemapId: PropTypes.string
};

export default Basemaps;
